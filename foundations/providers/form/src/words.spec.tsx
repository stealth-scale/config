import { type ReactElement } from "react";

import { render, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useAppForm, useSchemaForm } from "#hooks.fixtures.ts";
import { FormProvider } from "#provider.tsx";
import { type Schema } from "#schema.ts";
import { type Translate, translateFrom } from "#translate.ts";
import { useWords, wordsOf } from "#words.ts";

const catalogue = translateFrom({
  "checkout.actions.submit": "Place order",
  "checkout.errors.email.format": "Enter an address like name@example.com",
  "checkout.fields.email.description": "We never share it",
  "checkout.fields.email.label": "Email address",
  "checkout.fields.kind.options.business": "A business",
  "checkout.groups.who.legend": "Who is ordering",
  "checkout.steps.pay.label": "Payment",
  "errors.minLength": "Too short",
  "form.fields.email.label": "Any form's email",
  Taken: "That name is taken",
});

const words = wordsOf(catalogue, "checkout");

const schema: Schema = { properties: { email: { type: "string" } }, type: "object" };

/**
 * Draws the label of the email field as the words in scope resolve it.
 */
function Label(): ReactElement {
  return <output>{useWords().label("email")}</output>;
}

/**
 * Builds a form from the schema, translated by the catalogue given or the provider's.
 */
function Described({ translate }: { readonly translate?: Translate | undefined }): ReactElement {
  const form = useSchemaForm({ id: "checkout", schema, translate });

  return (
    <form.AppForm>
      <Label />
    </form.AppForm>
  );
}

/**
 * Builds a form from the library's own options.
 */
function Plain(): ReactElement {
  const form = useAppForm({ defaultValues: { email: "" } });

  return (
    <form.AppForm>
      <Label />
    </form.AppForm>
  );
}

describe("wordsOf", () => {
  it("reads a label from the catalogue and falls back to the path or the words given", () => {
    expect(words.label("email")).toBe("Email address");
    expect(words.label("billing.vatNumber")).toBe("Vat number");
    expect(words.label("billing.vatNumber", "VAT")).toBe("VAT");
  });

  it("reads a legend and a step and an option with their names as the defaults", () => {
    expect(words.legend("who")).toBe("Who is ordering");
    expect(words.legend("billing")).toBe("Billing");
    expect(words.step("pay")).toBe("Payment");
    expect(words.option("kind", "business")).toBe("A business");
    expect(words.option("kind", "individual")).toBe("individual");
  });

  it("reads an action with the English given as the default", () => {
    expect(words.action("submit", "Submit")).toBe("Place order");
    expect(words.action("next", "Next")).toBe("Next");
  });

  it("reads help text and a placeholder with the fallback or nothing as the default", () => {
    expect(words.description("email")).toBe("We never share it");
    expect(words.description("name")).toBe("");
    expect(words.description("name", "Your full name")).toBe("Your full name");
    expect(words.placeholder("email")).toBe("");
  });

  it("reads a keyworded error under the form's identifier and then the shared one", () => {
    expect(words.error("email", { keyword: "format", message: "Bad" })).toBe(
      "Enter an address like name@example.com",
    );
    expect(words.error("name", { keyword: "minLength", message: "Bad" })).toBe("Too short");
    expect(words.error("name", { keyword: "maxLength", message: "Too long" })).toBe("Too long");
    expect(words.error("name", { keyword: "taken" })).toBe("taken");
  });

  it("reads a string error as its own identifier and a plain value as text", () => {
    expect(words.error("name", "Taken")).toBe("That name is taken");
    expect(words.error("name", "Refused")).toBe("Refused");
    expect(words.error("name", 42)).toBe("42");
  });

  it("hands the translator the values an error carries", () => {
    const seen: unknown[] = [];
    const spying: Translate = (keys, options) => {
      seen.push(keys, options);

      return options.defaultValue;
    };

    wordsOf(spying, "checkout").error("name", {
      keyword: "minLength",
      message: "Bad",
      values: { minLength: 3 },
    });

    expect(seen).toStrictEqual([
      ["checkout.errors.name.minLength", "errors.minLength"],
      { defaultValue: "Bad", minLength: 3 },
    ]);
  });
});

describe("useWords", () => {
  it("reads a schema form's own identifier and translator", () => {
    const { getByRole } = render(<Described translate={catalogue} />);

    expect(getByRole("status").textContent).toBe("Email address");
  });

  it("reads the provider's translator where the form states none", () => {
    const { getByRole } = render(
      <FormProvider translate={catalogue}>
        <Described />
      </FormProvider>,
    );

    expect(getByRole("status").textContent).toBe("Email address");
  });

  it("reads the identifier form for a form built from the library's own options", () => {
    const { getByRole } = render(
      <FormProvider translate={catalogue}>
        <Plain />
      </FormProvider>,
    );

    expect(getByRole("status").textContent).toBe("Any form's email");
  });

  it("reads the defaults where nothing is in scope", () => {
    const { result } = renderHook(() => useWords());

    expect(result.current.label("email")).toBe("Email");
  });
});
