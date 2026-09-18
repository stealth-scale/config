import { describe, expect, it } from "vitest";

import { words } from "#words.ts";

describe("words", () => {
  it("reads a step's label and falls back to the default elsewhere", () => {
    expect(words("profile.steps.who.label", { defaultValue: "Who" })).toBe("Who you are");
    expect(words("profile.fields.name.label", { defaultValue: "Name" })).toBe("Name");
  });
});
