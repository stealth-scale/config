/**
 * Draws the page: a checkout form generated from the presentation its schema carries, the fields
 * the schema states and nobody placed, and every message the form reads.
 */

import { type ReactElement, useState } from "react";

import { FormNameContext } from "@stealthscale/example-form-fields";
import { catalogue, FormProvider, translateFrom } from "@stealthscale/provider-form";

import { CheckoutForm } from "#checkout-form.tsx";
import { checkout, presentation, unplacedFields } from "#schema.ts";

/**
 * The words the form reads. Every other word falls back to the schema's title or the path.
 */
const words = translateFrom({
  "checkout.fields.billing.country.options.BE": "Belgium",
  "checkout.fields.billing.country.options.NL": "Netherlands",
  "checkout.fields.kind.options.business": "A business",
  "checkout.fields.kind.options.individual": "An individual",
  "checkout.fields.vat.label": "VAT number",
  "checkout.groups.billing.legend": "Billing address",
  "checkout.groups.line.legend": "Lines",
  "checkout.groups.who.legend": "Who is ordering",
  "errors.minimum": "At least one",
});

/**
 * Every message the form reads, with the schema's own English beside each.
 */
const messages = catalogue(checkout, presentation);

/**
 * Draws the page, the report of unplaced fields, and the catalogue.
 */
export function App(): ReactElement {
  const [done, setDone] = useState<unknown>();

  return (
    <FormProvider translate={words}>
      <main>
        <h1>Checkout</h1>
        <FormNameContext value={presentation.id}>
          {done === undefined ? (
            <CheckoutForm onDone={setDone} />
          ) : (
            <output>
              <pre>{JSON.stringify(done, null, 2)}</pre>
            </output>
          )}
        </FormNameContext>
        <aside>
          <h2>Fields nobody placed</h2>
          <ul>
            {unplacedFields.map((path) => (
              <li key={path}>{path}</li>
            ))}
          </ul>
          <h2>Every message this form reads</h2>
          <table>
            <thead>
              <tr>
                <th>Identifier</th>
                <th>English</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.english}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </main>
    </FormProvider>
  );
}
