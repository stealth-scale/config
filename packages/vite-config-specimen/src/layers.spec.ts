import { describe, expect, it } from "vitest";

import { layers } from "#layers.ts";

const PATTERNS = ["src/**/*.specimen.tsx"];

describe("layers", () => {
  it("collects the index plugin and the scan entries", () => {
    expect(layers({ patterns: PATTERNS })).toHaveLength(3);
  });

  it("states the index plugin first", () => {
    expect(layers({ patterns: PATTERNS })[0]?.name).toBe("specimen.indexed");
  });

  it("names every layer under this package", () => {
    expect(
      layers({ patterns: PATTERNS }).every((layer) => layer.name.startsWith("specimen.")),
    ).toBe(true);
  });

  it("contributes one layer per pattern beyond the plugin and the html", () => {
    expect(layers({ patterns: [...PATTERNS, "pages/**/*.specimen.tsx"] })).toHaveLength(4);
  });
});
