import { describe, expect, it } from "vitest";

import { crawled } from "#crawled.ts";

const PATTERNS = ["src/**/*.specimen.tsx"];

describe("crawled", () => {
  it("contributes one entry per pattern and one for the html", () => {
    expect(crawled(PATTERNS)).toHaveLength(2);
  });

  it("names every layer for this package", () => {
    expect(crawled(PATTERNS).every((layer) => layer.name.startsWith("specimen.crawled"))).toBe(
      true,
    );
  });

  it("names each layer for the file it covers", () => {
    expect(crawled(PATTERNS).map((layer) => layer.name)).toStrictEqual([
      "specimen.crawled(**/*.html)",
      "specimen.crawled(src/**/*.specimen.tsx)",
    ]);
  });

  it("appends each entry to the dependency scan's entries", () => {
    expect(crawled(PATTERNS).every((layer) => layer.at === "optimizeDeps.entries")).toBe(true);
  });

  it("states why every layer exists", () => {
    expect(crawled(PATTERNS).every((layer) => layer.because !== "")).toBe(true);
  });
});
