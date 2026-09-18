import { describe, expect, it } from "vitest";

import { catalogue } from "#catalogue.ts";

const PATTERNS = ["src/**/*.specimen.tsx"];

describe("catalogue", () => {
  it("collects the index plugin and the scan entries", () => {
    expect(catalogue({ patterns: PATTERNS })).toHaveLength(3);
  });

  it("states the index plugin first", () => {
    expect(catalogue({ patterns: PATTERNS })[0]?.name).toBe("specimen.indexed");
  });

  it("names every layer under this package", () => {
    expect(
      catalogue({ patterns: PATTERNS }).every((layer) => layer.name.startsWith("specimen.")),
    ).toBe(true);
  });

  it("contributes one scan entry per pattern beyond the plugin and the html", () => {
    expect(catalogue({ patterns: [...PATTERNS, "pages/**/*.specimen.tsx"] })).toHaveLength(4);
  });
});
