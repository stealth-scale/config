/**
 * Evaluates a schema: the values to start from, the schema that applies to the values in hand,
 * and every issue with a value. One engine serves every form on a page.
 */

import {
  compileSchema,
  type Draft,
  draft2020,
  extendDraft,
  getTypeOf,
  type JsonSchemaValidator,
  type Keyword as LibraryKeyword,
  type SchemaNode,
} from "json-schema-library";

import { emptied } from "#empty.ts";
import { type Issue, issueOf } from "#issues.ts";
import { type Schema } from "#schema.ts";
import { formatsIn, pathsIn } from "#walk.ts";

/**
 * Describes a named format, written as `format: "<name>"` in any schema.
 */
export interface Format {
  /**
   * Reports whether a value passes.
   */
  readonly holds: (value: string) => boolean;

  /**
   * The name a schema writes.
   */
  readonly name: string;
}

/**
 * Describes a named keyword, written as `<name>: <parameter>` in any schema.
 *
 * @remarks
 *   A refusal reads as an issue under the keyword's name, so a catalogue entry at
 *   `<id>.errors.<path>.<name>` or `errors.<name>` gives it words, and the parameter the schema
 *   wrote is among the values the message reads.
 */
export interface Keyword {
  /**
   * Reports whether a value passes, given the parameter the schema wrote and every value the form
   * holds.
   */
  readonly holds: (parameter: unknown, value: unknown, values: unknown) => boolean;

  /**
   * The name a schema writes.
   */
  readonly name: string;

  /**
   * The JSON Schema types it applies to. Every type where a caller states none.
   */
  readonly on?: readonly string[] | undefined;
}

/**
 * Describes what evaluates a schema for every form on a page.
 */
export interface Engine {
  /**
   * Throws where the schema names a `format` this engine has no `Format` for.
   *
   * @throws {@link Error} When the schema names a format nobody registered.
   */
  readonly check: (schema: Schema) => void;

  /**
   * Builds the values a form starts from: every property present, `default` keywords applied, an
   * `enum` or a `const` with no `default` emptied, and the values given written over them.
   */
  readonly defaults: (schema: Schema, values?: unknown) => unknown;

  /**
   * Lists the path of every property any branch of the schema can produce.
   */
  readonly paths: (schema: Schema) => readonly string[];

  /**
   * Resolves the schema that applies to the values in hand.
   */
  readonly resolve: (schema: Schema, values: unknown) => Schema;

  /**
   * Lists every issue with the value, or none.
   */
  readonly validate: (schema: Schema, value: unknown) => readonly Issue[];
}

/**
 * Describes what an engine is built with. Registered once, for every form on the page.
 */
export interface EngineOptions {
  /**
   * The formats a schema may name.
   */
  readonly formats?: readonly Format[] | undefined;

  /**
   * The keywords a schema may write.
   */
  readonly keywords?: readonly Keyword[] | undefined;
}

/**
 * Reads the values the form is validating, for a keyword that reads more than its own value.
 */
interface Root {
  /**
   * The whole value under validation, or nothing between two validations.
   */
  current: unknown;
}

/**
 * Builds the library's validator for one format.
 *
 * @remarks
 *   A format applies to strings alone, as JSON Schema states, so any other value passes. The error
 *   code is registered on the draft beside the format, because the library throws from inside
 *   itself for a code it does not know.
 */
function formatValidator({ holds, name }: Format): JsonSchemaValidator {
  return ({ data, node, pointer }) =>
    typeof data !== "string" || holds(data)
      ? undefined
      : node.createError(`format-${name}-error`, {
          format: name,
          pointer,
          schema: node.schema,
          value: data,
        });
}

/**
 * Builds the library's keyword for one keyword of this design, which runs where the schema writes
 * its name, on the types it names or on every type, and receives the whole value the form is
 * validating beside its own.
 */
function libraryKeyword({ holds, name, on }: Keyword, root: Root): LibraryKeyword {
  return {
    addValidate: (node) => node.schema[name] !== undefined,
    id: name,
    keyword: name,
    validate: ({ data, node, pointer }) => {
      const parameter: unknown = node.schema[name];
      const applies = on === undefined || on.includes(getTypeOf(data));

      return !applies || holds(parameter, data, root.current)
        ? undefined
        : node.createError(`keyword-${name}-error`, {
            keyword: name,
            parameter,
            pointer,
            schema: node.schema,
            value: data,
          });
    },
  };
}

/**
 * Accepts every string, which is what `format: "password"` asks of a value. The format marks a
 * property a draft never keeps, and it is registered here so a schema naming it passes `check`.
 */
const password: Format = { holds: () => true, name: "password" };

/**
 * Builds the draft every schema is compiled against, with the formats and keywords registered.
 */
function draftOf(options: EngineOptions, root: Root): Draft {
  const formats = [password, ...(options.formats ?? [])];
  const keywords = options.keywords ?? [];

  return extendDraft(draft2020, {
    errors: Object.fromEntries<string>([
      ...formats.map((format): [string, string] => [
        `format-${format.name}-error`,
        `Value {{value}} at {{pointer}} is not a valid {{format}}`,
      ]),
      ...keywords.map((keyword): [string, string] => [
        `keyword-${keyword.name}-error`,
        `Value {{value}} at {{pointer}} fails ${keyword.name}`,
      ]),
    ]),
    formats: Object.fromEntries(formats.map((format) => [format.name, formatValidator(format)])),
    keywords: [...draft2020.keywords, ...keywords.map((keyword) => libraryKeyword(keyword, root))],
  });
}

/**
 * Removes the `oneOf` of a schema, which is what remains when no branch matches yet.
 */
function withoutOneOf(schema: Schema): Schema {
  const { oneOf: _oneOf, ...rest } = schema;

  return rest;
}

/**
 * Builds the engine that evaluates every schema on a page.
 *
 * @remarks
 *   A schema is compiled once and kept by identity, so a form that resolves on every change pays
 *   the compilation once. `resolve` answers the schema with its `oneOf` removed where no branch
 *   matches yet, which is the properties every branch shares.
 */
export function createEngine(options?: EngineOptions): Engine {
  const root: Root = { current: undefined };
  const draft = draftOf(options ?? {}, root);
  const compiled = new WeakMap<Schema, SchemaNode>();

  /**
   * Compiles a schema once and keeps it.
   */
  const nodeOf = (schema: Schema): SchemaNode => {
    const kept = compiled.get(schema);

    if (kept !== undefined) return kept;

    const node = compileSchema(schema, { drafts: [draft] });

    compiled.set(schema, node);

    return node;
  };

  return {
    check: (schema) => {
      for (const format of formatsIn(schema)) {
        if (!(format in draft.formats))
          throw new Error(`The schema names the format "${format}", which no Format registered`);
      }
    },
    defaults: (schema, values) => {
      const built: unknown = nodeOf(schema).getData(values, { addOptionalProps: true });

      return emptied(schema, built, values);
    },
    paths: pathsIn,
    resolve: (schema, values) => {
      const { node } = nodeOf(schema).reduceNode(values);

      return node === undefined ? withoutOneOf(schema) : node.schema;
    },
    validate: (schema, value) => {
      root.current = value;

      const { errors } = nodeOf(schema).validate(value);

      root.current = undefined;

      return errors.map((error) => issueOf(error));
    },
  };
}

/**
 * The engine used where a caller states none, built on first use.
 */
let shared: Engine | undefined;

/**
 * Returns the engine used where a caller states none: no formats and no keywords beyond the
 * draft's own.
 */
export function defaultEngine(): Engine {
  shared ??= createEngine();

  return shared;
}
