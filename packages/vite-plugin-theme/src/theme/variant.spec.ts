import { describe, expect, it } from "vitest";

import { type Preset } from "#pandacss.ts";
import { completed } from "#theme/variant.ts";

const FOUNDATION: Preset = {
  name: "@acme/design",
  theme: {
    extend: {
      semanticTokens: {
        colors: { bg: { value: { _dark: "{colors.gray.900}", base: "{colors.gray.100}" } } },
      },
      tokens: {
        colors: { gray: { 100: { value: "#eee" }, 900: { value: "#111" } } },
        fonts: { body: { value: "sans-serif" }, heading: { value: "serif" } },
        radii: { l1: { value: "4px" } },
      },
    },
  },
};

describe("completed", () => {
  it("restates every token category the variant leaves out", () => {
    const variant = completed({ tokens: { radii: { l1: { value: "8px" } } } }, FOUNDATION);

    expect(variant.tokens?.fonts).toStrictEqual({
      body: { value: "sans-serif" },
      heading: { value: "serif" },
    });
    expect(variant.tokens?.colors).toStrictEqual({
      gray: { 100: { value: "#eee" }, 900: { value: "#111" } },
    });
    expect(variant.semanticTokens?.colors).toStrictEqual({
      bg: { value: { _dark: "{colors.gray.900}", base: "{colors.gray.100}" } },
    });
  });

  it("keeps the variant's token over the foundation's with every mode it states", () => {
    const variant = completed(
      { semanticTokens: { colors: { bg: { value: "{colors.gray.100}" } } } },
      FOUNDATION,
    );

    expect(variant.semanticTokens?.colors).toStrictEqual({ bg: { value: "{colors.gray.100}" } });
  });

  it("fills a group the variant states in part", () => {
    const variant = completed({ tokens: { fonts: { body: { value: "Inter" } } } }, FOUNDATION);

    expect(variant.tokens?.fonts).toStrictEqual({
      body: { value: "Inter" },
      heading: { value: "serif" },
    });
  });

  it("keeps a token the foundation does not define", () => {
    const variant = completed({ tokens: { fonts: { mono: { value: "monospace" } } } }, FOUNDATION);

    expect(variant.tokens?.fonts).toStrictEqual({
      body: { value: "sans-serif" },
      heading: { value: "serif" },
      mono: { value: "monospace" },
    });
  });

  it("states no category that neither the variant nor the foundation states", () => {
    const variant = completed({}, { name: "@acme/bare" });

    expect(variant).toStrictEqual({});
  });

  it("returns the variant as it is where the foundation extends nothing", () => {
    const variant = completed(
      { tokens: { radii: { l1: { value: "8px" } } } },
      { name: "@acme/bare", theme: {} },
    );

    expect(variant).toStrictEqual({ tokens: { radii: { l1: { value: "8px" } } } });
  });
});
