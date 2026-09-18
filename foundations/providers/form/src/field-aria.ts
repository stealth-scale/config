/**
 * Computes what ties a control to its label, its help text and its error for a screen reader,
 * and the words each shows, so a component package spreads them rather than writes them.
 */

import { useId } from "react";

import { useFieldContext } from "#contexts.ts";
import { collapse } from "#path.ts";
import { type Field } from "#presentation.ts";
import { textOf } from "#property.ts";
import { useDescribed } from "#registry.ts";
import { type Schema } from "#schema.ts";
import { useProperty } from "#use-property.ts";
import { useWords, type Words } from "#words.ts";

/**
 * Describes the props a control element is given.
 */
export interface ControlProps {
  /**
   * The ids of the help text and the error, whichever are on the page, so a screen reader reads
   * them with the control.
   */
  readonly "aria-describedby"?: string | undefined;

  /**
   * The id of the error, while one is shown.
   */
  readonly "aria-errormessage"?: string | undefined;

  /**
   * Whether the control shows an error.
   */
  readonly "aria-invalid": boolean;

  /**
   * Whether the schema requires a value.
   */
  readonly "aria-required": boolean;

  /**
   * The purpose of the field, as the presentation states it for the browser to fill.
   */
  readonly autoComplete?: string | undefined;

  /**
   * The id the label points at.
   */
  readonly id: string;

  /**
   * The field's path, written as the control's name so a refused submit finds it.
   */
  readonly name: string;

  /**
   * The placeholder, where the catalogue has one.
   */
  readonly placeholder?: string | undefined;
}

/**
 * Describes the props a label element is given.
 */
export interface LabelProps {
  /**
   * The id of the control.
   */
  readonly htmlFor: string;

  /**
   * The label's own id.
   */
  readonly id: string;
}

/**
 * Describes the props the help text's element is given.
 */
export interface DescriptionProps {
  /**
   * The id the control's `aria-describedby` names.
   */
  readonly id: string;
}

/**
 * Describes the props the error's element is given.
 *
 * @remarks
 *   The error is an alert, so a screen reader announces it when it appears while focus is
 *   somewhere else, which is what happens when a field is refused on blur.
 */
export interface ErrorProps {
  /**
   * The id the control's `aria-describedby` and `aria-errormessage` name.
   */
  readonly id: string;

  /**
   * The live role.
   */
  readonly role: "alert";
}

/**
 * Describes one piece of text a field shows, with the props of the element that shows it.
 *
 * @typeParam Props - The props of the element.
 */
export interface Worded<Props> {
  /**
   * The props the element is given.
   */
  readonly props: Props;

  /**
   * The words the element shows.
   */
  readonly text: string;
}

/**
 * Describes what ties one control to its label, its help text and its error.
 */
export interface FieldAria {
  /**
   * The props of the control.
   */
  readonly control: ControlProps;

  /**
   * The help text and its props, or nothing where the field has none.
   */
  readonly description: undefined | Worded<DescriptionProps>;

  /**
   * The error and its props, or nothing while none is shown.
   */
  readonly error: undefined | Worded<ErrorProps>;

  /**
   * The label and its props.
   */
  readonly label: Worded<LabelProps>;
}

/**
 * Describes what a component may state beside what the schema and the presentation say.
 */
export interface FieldAriaOptions {
  /**
   * The words of the label, where the catalogue has none and the schema's title is wrong.
   */
  readonly label?: string | undefined;

  /**
   * Whether a value is required. The resolved schema's answer where a generated form hands it
   * in, and the full schema's where nothing is stated.
   */
  readonly required?: boolean | undefined;
}

/**
 * Describes the texts of one field, resolved: the label, the help text where there is one, and
 * the placeholder where there is one.
 */
interface Texts {
  /**
   * The help text, or nothing.
   */
  readonly help: string | undefined;

  /**
   * The label.
   */
  readonly label: string;

  /**
   * The placeholder, or nothing.
   */
  readonly placeholder: string | undefined;
}

/**
 * Turns an empty string, which the words answer where a catalogue has nothing, into nothing.
 */
function some(text: string): string | undefined {
  return text === "" ? undefined : text;
}

/**
 * Describes what the texts of a field are resolved from.
 */
interface Source {
  /**
   * The words of the label a component gives, or nothing.
   */
  readonly label: string | undefined;

  /**
   * The field's path, as the bound field writes it.
   */
  readonly name: string;

  /**
   * The property's schema, or nothing.
   */
  readonly schema: Schema | undefined;

  /**
   * How the field is drawn, as the presentation states it.
   */
  readonly setting: Field;

  /**
   * The words of the form.
   */
  readonly words: Words;
}

/**
 * Resolves the texts of a field: the label, the help text and the placeholder.
 *
 * @remarks
 *   The label reads the catalogue, then the words given, then the schema's `title`, then the
 *   path written out. The help text reads the catalogue and then the schema's `description`. An
 *   identifier the presentation states for any of the three is tried before the derived one.
 */
function textsOf({ label, name, schema, setting, words }: Source): Texts {
  const title = schema === undefined ? undefined : textOf(schema, "title");
  const description = schema === undefined ? undefined : textOf(schema, "description");

  return {
    help: some(words.description(name, description, setting.description)),
    label: words.label(name, label ?? title, setting.label),
    placeholder: some(words.placeholder(name, setting.placeholder)),
  };
}

/**
 * Describes what the wiring of a field is built from.
 */
interface Wiring {
  /**
   * The error shown, or nothing.
   */
  readonly error: string | undefined;

  /**
   * The id of the control.
   */
  readonly id: string;

  /**
   * The field's path, as the bound field writes it.
   */
  readonly name: string;

  /**
   * Whether the schema requires a value.
   */
  readonly required: boolean;

  /**
   * How the field is drawn, as the presentation states it.
   */
  readonly setting: Field;

  /**
   * The texts, resolved.
   */
  readonly texts: Texts;
}

/**
 * Joins the ids of the texts that are on the page, or nothing where none is.
 */
function describedBy(ids: ReadonlyArray<string | undefined>): string | undefined {
  const present = ids.filter((id) => id !== undefined);

  return present.length === 0 ? undefined : present.join(" ");
}

/**
 * Builds what ties a control to its label, its help text and its error.
 *
 * @remarks
 *   `aria-describedby` names the help text and the error only while each is on the page,
 *   because an id that names nothing is an error of its own.
 */
function ariaOf({ error, id, name, required, setting, texts }: Wiring): FieldAria {
  const description: undefined | Worded<DescriptionProps> =
    texts.help === undefined ? undefined : { props: { id: `${id}-help` }, text: texts.help };
  const message: undefined | Worded<ErrorProps> =
    error === undefined ? undefined : { props: { id: `${id}-error`, role: "alert" }, text: error };

  return {
    control: {
      "aria-describedby": describedBy([description?.props.id, message?.props.id]),
      "aria-errormessage": message?.props.id,
      "aria-invalid": message !== undefined,
      "aria-required": required,
      autoComplete: setting.autocomplete,
      id,
      name,
      placeholder: texts.placeholder,
    },
    description,
    error: message,
    label: { props: { htmlFor: id, id: `${id}-label` }, text: texts.label },
  };
}

/**
 * Computes what ties the control of the field in scope to its label, its help text and its
 * error, with the words each shows.
 *
 * @remarks
 *   The error is shown once a person has touched the field or a submit was attempted, and the
 *   first error in slot order is the one shown. The purpose the presentation states under
 *   `autocomplete` is written on the control, so a browser fills it and a person is asked once.
 */
export function useFieldAria(options: FieldAriaOptions = {}): FieldAria {
  const field = useFieldContext();
  const described = useDescribed(field.form);
  const property = useProperty();
  const words = useWords();
  const id = useId();
  const name: string = field.name;
  const setting: Field = described?.presentation.fields?.[collapse(name)] ?? {};
  const errors: readonly unknown[] = field.state.meta.errors;
  const [error] = errors;
  const shown = field.state.meta.isTouched && error !== undefined;

  return ariaOf({
    error: shown ? words.error(name, error) : undefined,
    id,
    name,
    required: options.required ?? property.required,
    setting,
    texts: textsOf({ label: options.label, name, schema: property.schema, setting, words }),
  });
}
