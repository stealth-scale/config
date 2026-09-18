import { describe, expect, it } from "vitest";

import { words } from "#words.ts";

describe("words", () => {
  it("reads a keyword of the form's own the way a schema keyword reads", () => {
    expect(words(["signup.errors.username.taken", "errors.taken"], { defaultValue: "taken" })).toBe(
      "That name is taken",
    );
    expect(words("signup.fields.nowhere.label", { defaultValue: "Nowhere" })).toBe("Nowhere");
  });
});
