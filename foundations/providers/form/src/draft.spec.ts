import { describe, expect, it } from "vitest";

import { memoryStore } from "@stealthscale/settings";

import { type Draft, draftKey, parseDraft, schemaHash, withoutPaths, writeDraft } from "#draft.ts";
import { type Schema } from "#schema.ts";

const signup: Schema = { properties: { name: { type: "string" } }, type: "object" };

describe("draftKey", () => {
  it("writes the key beside the application's settings", () => {
    expect(draftKey("docs", "signup")).toBe("stealth.docs.form.signup");
  });
});

describe("schemaHash", () => {
  it("hashes two schemas written in different key orders the same", () => {
    expect(schemaHash({ properties: { name: { type: "string" } }, type: "object" })).toBe(
      schemaHash({ properties: { name: { type: "string" } }, type: "object" }),
    );
  });

  it("changes when a keyword changes", () => {
    expect(schemaHash(signup)).not.toBe(
      schemaHash({ properties: { name: { minLength: 3, type: "string" } }, type: "object" }),
    );
  });

  it("hashes a member holding nothing as null", () => {
    expect(schemaHash({ a: undefined, b: [undefined] })).toBe(schemaHash({ a: null, b: [null] }));
  });

  it("writes eight hexadecimal digits", () => {
    expect(schemaHash({ items: [1, "a", null, true], nested: { list: [[]] } })).toMatch(
      /^[\da-f]{8}$/u,
    );
  });
});

describe("withoutPaths", () => {
  it("removes a nested path and follows [] into every item", () => {
    const values = {
      billing: { card: "4111", city: "Delft" },
      lines: [
        { amount: 1, secret: "a" },
        { amount: 2, secret: "b" },
      ],
      name: "Roy",
    };

    expect(withoutPaths(values, ["billing.card", "lines[].secret"])).toStrictEqual({
      billing: { city: "Delft" },
      lines: [{ amount: 1 }, { amount: 2 }],
      name: "Roy",
    });
    expect(values.billing.card).toBe("4111");
  });

  it("ignores a path the value does not have", () => {
    expect(withoutPaths({ name: "Roy" }, ["billing.card", "lines[].secret", "gone"])).toStrictEqual(
      {
        name: "Roy",
      },
    );
  });
});

describe("parseDraft", () => {
  it("parses back the draft written for the same schema", () => {
    const store = memoryStore();
    const draft: Draft = { hash: schemaHash(signup), step: "who", values: { name: "Roy" } };

    writeDraft(store, "k", draft);

    expect(parseDraft(String(store.read("k")), schemaHash(signup))).toStrictEqual(draft);
  });

  it("answers nothing for a draft typed against another schema", () => {
    const text = JSON.stringify({ hash: "00000000", values: { name: "Roy" } });

    expect(parseDraft(text, schemaHash(signup))).toBeUndefined();
  });

  it("answers nothing for text that is not a draft", () => {
    expect(parseDraft("{not json", schemaHash(signup))).toBeUndefined();
    expect(parseDraft("{}", schemaHash(signup))).toBeUndefined();
  });
});
