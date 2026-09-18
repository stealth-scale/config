/**
 * Lists every message a form reads, with the development English beside each, so a catalogue is
 * generated rather than gathered.
 */

import { identifiers } from "#identifiers.ts";
import { type Group, isGroup, type Member, type Presentation } from "#presentation.ts";
import { type Schema } from "#schema.ts";
import { worded } from "#translate.ts";
import { walk } from "#walk.ts";

/**
 * Describes one message a form reads.
 */
export interface CatalogueEntry {
  /**
   * The development English: the schema's own text, the path written out, or nothing for a
   * failure.
   */
  readonly english: string;

  /**
   * The message identifier a catalogue answers.
   */
  readonly id: string;
}

/**
 * Lists the keywords of a property whose failure a form reads a message for.
 */
const FAILING = [
  "const",
  "enum",
  "format",
  "maximum",
  "maxItems",
  "maxLength",
  "minimum",
  "minItems",
  "minLength",
  "pattern",
  "type",
] as const;

/**
 * Lists the failures of the properties one schema requires, at the root or under a path.
 */
function requiredOf(
  path: string,
  node: Schema,
  form: ReturnType<typeof identifiers>,
): CatalogueEntry[] {
  const { required } = node;

  if (!Array.isArray(required)) return [];

  return required.flatMap((name) =>
    typeof name === "string"
      ? [{ english: "", id: form.error(path === "" ? name : `${path}.${name}`, "required")[0] }]
      : [],
  );
}

/**
 * Lists the failures one property reads a message for: each keyword that can fail, and each
 * property it requires.
 */
function failures(
  path: string,
  node: Schema,
  form: ReturnType<typeof identifiers>,
): CatalogueEntry[] {
  const entries: CatalogueEntry[] = [];

  for (const keyword of FAILING) {
    if (node[keyword] !== undefined) {
      entries.push({ english: "", id: form.error(path, keyword)[0] });
    }
  }

  return [...entries, ...requiredOf(path, node, form)];
}

/**
 * Lists the messages one property reads: its label, its help text, each choice of an enum, and
 * each failure.
 */
function ofProperty(
  path: string,
  node: Schema,
  form: ReturnType<typeof identifiers>,
): CatalogueEntry[] {
  const { description, enum: choices, title } = node;
  const entries: CatalogueEntry[] = path.endsWith("[]")
    ? []
    : [{ english: typeof title === "string" ? title : worded(path), id: form.label(path) }];

  if (typeof description === "string") {
    entries.push({ english: description, id: form.description(path) });
  }

  if (Array.isArray(choices)) {
    for (const choice of choices) {
      entries.push({ english: String(choice), id: form.option(path, String(choice)) });
    }
  }

  return [...entries, ...failures(path, node, form)];
}

/**
 * Lists the legends of the groups in a run of members, walked.
 */
function ofGroups<Values>(
  run: ReadonlyArray<Member<Values>>,
  form: ReturnType<typeof identifiers>,
): CatalogueEntry[] {
  return run.flatMap((member) => {
    if (!isGroup(member)) return [];

    const own: Group<Values> = member;
    const below = ofGroups(own.of, form);

    return own.legend === true && own.name !== undefined
      ? [{ english: worded(own.name), id: form.legend(own.name) }, ...below]
      : below;
  });
}

/**
 * Lists every message a form reads, in the order the schema and the presentation state them.
 *
 * @remarks
 *   Every identifier is computable without rendering the form, so a translator receives a
 *   complete catalogue for a form nobody has rendered. A failure's English is empty, because the
 *   engine's own message is the development text at run time and a catalogue entry replaces it.
 *   An array's item has no label of its own, because a repeat group draws it under the group's
 *   legend.
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
export function catalogue<Values>(
  schema: Schema,
  presentation: Presentation<Values>,
): readonly CatalogueEntry[] {
  const form = identifiers(presentation.id);
  const entries: CatalogueEntry[] = requiredOf("", schema, form);
  const seen = new Set<string>(entries.map((entry) => entry.id));

  walk(schema, (path, node) => {
    for (const entry of ofProperty(path, node, form)) {
      if (!seen.has(entry.id)) {
        seen.add(entry.id);
        entries.push(entry);
      }
    }
  });

  entries.push(...ofGroups(presentation.of ?? [], form));

  for (const step of presentation.steps?.of ?? []) {
    entries.push(
      { english: worded(step.name), id: form.step(step.name) },
      ...ofGroups(step.of, form),
    );
  }

  return entries;
}
