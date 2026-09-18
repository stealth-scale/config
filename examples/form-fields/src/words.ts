/**
 * Resolves every word a field component shows: the label, the help text, the choices and the
 * error, each through the translator in scope under the form's identifier.
 */

import {
  identifiers,
  type Translate,
  useFormEnvironment,
  worded,
} from "@stealthscale/provider-form";

import { useFormName } from "#name.ts";

/**
 * Describes an error a schema or a validator answered with a keyword: the engine's issue, or an
 * object a validator of the caller's own returned.
 */
interface Keyworded {
  /**
   * The keyword that refused, which the error's identifier is derived from.
   */
  readonly keyword: string;

  /**
   * The development text, where the error has any.
   */
  readonly message?: string | undefined;

  /**
   * The values the message reads.
   */
  readonly values?: Readonly<Record<string, unknown>> | undefined;
}

/**
 * Reports whether an error carries a keyword.
 */
function isKeyworded(error: unknown): error is Keyworded {
  return (
    typeof error === "object" &&
    error !== null &&
    "keyword" in error &&
    typeof error.keyword === "string"
  );
}

/**
 * Describes the words one form shows, each resolved through the translator.
 */
export interface Words {
  /**
   * Resolves a field's help text, or an empty string where the catalogue has none.
   */
  readonly description: (path: string) => string;

  /**
   * Resolves an error: a keyworded one under the form's own identifier and then the shared one,
   * with the development text as the default, and a string as its own identifier and default.
   */
  readonly error: (path: string, error: unknown) => string;

  /**
   * Resolves a field's label, with the fallback given or the path written out as the default.
   */
  readonly label: (path: string, fallback?: string) => string;

  /**
   * Resolves a group's legend, with the name written out as the default.
   */
  readonly legend: (name: string) => string;

  /**
   * Resolves one choice of an enum, with the value as the default.
   */
  readonly option: (path: string, value: string) => string;

  /**
   * Resolves a field's placeholder, or an empty string where the catalogue has none.
   */
  readonly placeholder: (path: string) => string;

  /**
   * Resolves a step's label, with the name written out as the default.
   */
  readonly step: (name: string) => string;
}

/**
 * Builds the words one form shows, over a translator and the form's identifier.
 */
export function wordsOf(translate: Translate, id: string): Words {
  const ids = identifiers(id);

  return {
    description: (path) => translate(ids.description(path), { defaultValue: "" }),
    error: (path, error) => {
      if (isKeyworded(error)) {
        const { keyword, message, values } = error;

        return translate([...ids.error(path, keyword)], {
          ...values,
          defaultValue: message ?? keyword,
        });
      }

      const text = String(error);

      return translate(text, { defaultValue: text });
    },
    label: (path, fallback = worded(path)) =>
      translate(ids.label(path), { defaultValue: fallback }),
    legend: (name) => translate(ids.legend(name), { defaultValue: worded(name) }),
    option: (path, value) => translate(ids.option(path, value), { defaultValue: value }),
    placeholder: (path) => translate(ids.placeholder(path), { defaultValue: "" }),
    step: (name) => translate(ids.step(name), { defaultValue: worded(name) }),
  };
}

/**
 * Reads the words of the form being drawn, through the translator in scope.
 */
export function useWords(): Words {
  const { translate } = useFormEnvironment();

  return wordsOf(translate, useFormName());
}
