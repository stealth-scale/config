import { describe, expect, it } from "vitest";

import { translateFrom } from "@stealthscale/provider-form";

import { catalogues } from "#words.ts";

describe("catalogues", () => {
  it("names the same keys in both languages", () => {
    expect(Object.keys(catalogues.nl)).toStrictEqual(Object.keys(catalogues.en));
  });

  it("reads the words a form derives under the form's identifier", () => {
    const english = translateFrom(catalogues.en);
    const dutch = translateFrom(catalogues.nl);

    expect(english("contact.actions.submit", { defaultValue: "Submit" })).toBe("Send");
    expect(dutch("contact.fields.name.label", { defaultValue: "Name" })).toBe("Uw naam");
  });
});
