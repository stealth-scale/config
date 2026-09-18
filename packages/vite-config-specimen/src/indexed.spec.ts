import { describe, expect, it } from "vitest";

import { indexed } from "#indexed.ts";

const PATTERNS = ["src/**/*.specimen.tsx"];

describe("indexed", () => {
  it("names the layer for the call that built it", () => {
    expect(indexed({ patterns: PATTERNS }).name).toBe("specimen.indexed");
  });

  it("appends the plugin to the plugins key", () => {
    expect(indexed({ patterns: PATTERNS }).at).toBe("plugins");
  });

  it("states why the layer exists", () => {
    expect(indexed({ patterns: PATTERNS }).because).not.toBe("");
  });

  it("contributes the specimen plugin", () => {
    const { item } = indexed({ patterns: PATTERNS });

    expect(typeof item === "object" && item !== null ? Reflect.get(item, "name") : "").toBe(
      "stealth:specimens",
    );
  });

  it("builds one plugin instance per call", () => {
    expect(indexed({ patterns: PATTERNS }).item).not.toBe(indexed({ patterns: PATTERNS }).item);
  });
});
