import { describe, expect, it } from "vitest";

import { catalogues, translator } from "#words.ts";

const english = translator("en");
const dutch = translator("nl");

describe("translator", () => {
  it("answers the first key the catalogue has in the language asked", () => {
    const keys = ["contact.errors.email.format", "errors.format"];

    expect(english(keys, { defaultValue: "Bad" })).toBe("Enter an address like name@example.com");
    expect(dutch(keys, { defaultValue: "Bad" })).toBe("Vul een adres in zoals naam@voorbeeld.nl");
  });

  it("answers the default where the catalogue has none of the keys", () => {
    expect(english("contact.fields.name.placeholder", { defaultValue: "" })).toBe("");
  });

  it("interpolates the values into a found message and into the default", () => {
    expect(english("contact.errors.name.minLength", { defaultValue: "", minLength: 2 })).toBe(
      "Enter at least 2 characters",
    );
    expect(english("nowhere", { defaultValue: "Hi {{name}} {{missing}}", name: "Roy" })).toBe(
      "Hi Roy ",
    );
  });

  it("writes a string or a number into a message and anything else as nothing", () => {
    expect(english("nowhere", { a: "x", b: 3, c: {}, defaultValue: "{{a}}|{{b}}|{{c}}" })).toBe(
      "x|3|",
    );
  });

  it("names the same keys in both languages", () => {
    expect(Object.keys(catalogues.nl)).toStrictEqual(Object.keys(catalogues.en));
  });
});
