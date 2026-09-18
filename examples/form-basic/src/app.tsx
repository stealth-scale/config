/**
 * Draws the page: a language switch, and the contact form whose every word comes from the
 * catalogue of the language chosen.
 */

import { type ReactElement, useState } from "react";

import { FormNameContext } from "@stealthscale/example-form-fields";
import { FormProvider } from "@stealthscale/provider-form";

import { ContactForm } from "#contact-form.tsx";
import { type Contact } from "#schema.ts";
import { type Language, translator } from "#words.ts";

/**
 * Draws the page, and switches every word of it between English and Dutch.
 */
export function App(): ReactElement {
  const [language, setLanguage] = useState<Language>("en");
  const [sent, setSent] = useState<Contact>();
  const translate = translator(language);

  return (
    <FormProvider translate={translate}>
      <main>
        <h1>Contact</h1>
        <p>
          <button
            onClick={() => {
              setLanguage(language === "en" ? "nl" : "en");
            }}
            type="button"
          >
            {language === "en" ? "Nederlands" : "English"}
          </button>
        </p>
        <FormNameContext value="contact">
          {sent === undefined ? (
            <ContactForm onSent={setSent} />
          ) : (
            <output>{translate("contact.sent", { defaultValue: "Sent", name: sent.name })}</output>
          )}
        </FormNameContext>
      </main>
    </FormProvider>
  );
}
