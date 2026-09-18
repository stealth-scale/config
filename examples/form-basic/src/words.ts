/**
 * Every word the page and the contact form read, in two languages, keyed the way the foundation
 * derives identifiers, and the translator that answers them.
 */

import { type Translate } from "@stealthscale/provider-form";

/**
 * The languages the page offers.
 */
export type Language = "en" | "nl";

/**
 * Every word the contact form reads, by language.
 *
 * @remarks
 *   A field's words are keyed `contact.fields.<path>.<kind>`, a legend
 *   `contact.groups.<name>.legend`, and an error `contact.errors.<path>.<keyword>` or
 *   `errors.<keyword>` for every form at once. The two keys under `contact` that no field derives,
 *   `send` and `sent`, are the page's own.
 */
export const catalogues: Readonly<Record<Language, Readonly<Record<string, string>>>> = {
  en: {
    "contact.errors.consent.const": "Tick the box to continue",
    "contact.errors.email.minLength": "Enter your email address",
    "contact.errors.name.minLength": "Enter at least {{minLength}} characters",
    "contact.errors.topic.enum": "Pick a topic",
    "contact.fields.consent.label": "I agree to be contacted",
    "contact.fields.email.description": "We answer within a day",
    "contact.fields.email.label": "Email address",
    "contact.fields.message.label": "Your message",
    "contact.fields.name.label": "Your name",
    "contact.fields.topic.label": "Topic",
    "contact.fields.topic.options.sales": "Sales",
    "contact.fields.topic.options.support": "Support",
    "contact.fields.topic.placeholder": "Choose a topic",
    "contact.groups.what.legend": "What you need",
    "contact.groups.who.legend": "Who you are",
    "contact.send": "Send",
    "contact.sent": "Thanks {{name}}, we have your message",
    "errors.format": "Enter an address like name@example.com",
    "errors.maxLength": "Keep it under {{maxLength}} characters",
  },
  nl: {
    "contact.errors.consent.const": "Vink het vakje aan om verder te gaan",
    "contact.errors.email.minLength": "Vul uw e-mailadres in",
    "contact.errors.name.minLength": "Vul minstens {{minLength}} tekens in",
    "contact.errors.topic.enum": "Kies een onderwerp",
    "contact.fields.consent.label": "Ik ga akkoord met contact",
    "contact.fields.email.description": "We antwoorden binnen een dag",
    "contact.fields.email.label": "E-mailadres",
    "contact.fields.message.label": "Uw bericht",
    "contact.fields.name.label": "Uw naam",
    "contact.fields.topic.label": "Onderwerp",
    "contact.fields.topic.options.sales": "Verkoop",
    "contact.fields.topic.options.support": "Ondersteuning",
    "contact.fields.topic.placeholder": "Kies een onderwerp",
    "contact.groups.what.legend": "Wat u nodig heeft",
    "contact.groups.who.legend": "Wie u bent",
    "contact.send": "Versturen",
    "contact.sent": "Bedankt {{name}}, we hebben uw bericht",
    "errors.format": "Vul een adres in zoals naam@voorbeeld.nl",
    "errors.maxLength": "Houd het onder {{maxLength}} tekens",
  },
};

/**
 * Matches a placeholder in a message, written as i18next writes one.
 */
const PLACEHOLDER = /\{\{(\w+)\}\}/gu;

/**
 * Writes a value into a message: a string or a number as it is, and anything else as nothing.
 */
function written(value: unknown): string {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

/**
 * Builds a translator over one language's catalogue.
 *
 * @remarks
 *   The translator has i18next's shape and does what i18next does with these options: it tries
 *   the keys in order, answers the default where none is found, and interpolates `{{name}}` from
 *   the values in both. An application over i18next hands the foundation its `t` instead, and
 *   nothing on the page changes.
 */
export function translator(language: Language): Translate {
  const words = catalogues[language];

  return (keys, { defaultValue, ...values }) => {
    const found =
      (typeof keys === "string" ? [keys] : keys)
        .map((key) => words[key])
        .find((word) => word !== undefined) ?? defaultValue;

    return found.replaceAll(PLACEHOLDER, (_, name: string) => written(values[name]));
  };
}
