import { type ReactNode } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormProvider, type Translate, translateFrom } from "@stealthscale/provider-form";

import { FormNameContext } from "#name.ts";
import { useWords, wordsOf } from "#words.ts";

const catalogue = translateFrom({
  "checkout.errors.email.format": "Enter an address like name@example.com",
  "checkout.fields.email.description": "We never share it",
  "checkout.fields.email.label": "Email address",
  "checkout.fields.kind.options.business": "A business",
  "checkout.groups.who.legend": "Who is ordering",
  "checkout.steps.pay.label": "Payment",
  "errors.minLength": "Too short",
  Taken: "That name is taken",
});

const words = wordsOf(catalogue, "checkout");

/**
 * Puts the catalogue and the form's identifier in scope.
 */
function scoping({ children }: { children?: ReactNode }): ReactNode {
  return (
    <FormProvider translate={catalogue}>
      <FormNameContext value="checkout">{children}</FormNameContext>
    </FormProvider>
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

  it("reads help text and a placeholder as empty where the catalogue has none", () => {
    expect(words.description("email")).toBe("We never share it");
    expect(words.description("name")).toBe("");
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
  it("reads the translator in scope under the form's identifier", () => {
    const { result } = renderHook(() => useWords(), { wrapper: scoping });

    expect(result.current.label("email")).toBe("Email address");
  });

  it("reads the defaults where nothing is in scope", () => {
    const { result } = renderHook(() => useWords());

    expect(result.current.label("email")).toBe("Email");
  });
});
