import { describe, expect, it } from "vitest";

import { type Preset, type ThemeVariant } from "#pandacss.ts";
import { completed, stated } from "#theme/variant.ts";

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

const FOLIO: ThemeVariant = { tokens: { fonts: { body: { value: "Georgia" } } } };

const FORGE: ThemeVariant = { tokens: { radii: { l1: { value: "8px" } } } };

describe("completed", () => {
  it("lists every token any variant states as one shape", () => {
    expect(stated([FOLIO, FORGE, {}])).toStrictEqual({
      tokens: { fonts: { body: { value: "Georgia" } }, radii: { l1: { value: "8px" } } },
    });
  });

  it("fills a token another theme states with the foundation's value", () => {
    const shape = stated([FOLIO, FORGE]);

    expect(completed(FORGE, FOUNDATION, shape).tokens).toStrictEqual({
      fonts: { body: { value: "sans-serif" } },
      radii: { l1: { value: "8px" } },
    });
    expect(completed(FOLIO, FOUNDATION, shape).tokens).toStrictEqual({
      fonts: { body: { value: "Georgia" } },
      radii: { l1: { value: "4px" } },
    });
  });

  it("leaves a token no theme states out", () => {
    const variant = completed(FORGE, FOUNDATION, stated([FORGE]));

    expect(variant).toStrictEqual({ tokens: { radii: { l1: { value: "8px" } } } });
    expect(variant.tokens?.colors).toBeUndefined();
  });

  it("keeps the variant's token over the foundation's with every mode it states", () => {
    const own: ThemeVariant = {
      semanticTokens: { colors: { bg: { value: "{colors.gray.100}" } } },
    };

    expect(completed(own, FOUNDATION, stated([own])).semanticTokens).toStrictEqual({
      colors: { bg: { value: "{colors.gray.100}" } },
    });
  });

  it("fills only the token of a group that another theme states", () => {
    const other: ThemeVariant = { tokens: { fonts: { heading: { value: "Inter" } } } };

    expect(completed(FOLIO, FOUNDATION, stated([FOLIO, other])).tokens?.fonts).toStrictEqual({
      body: { value: "Georgia" },
      heading: { value: "serif" },
    });
  });

  it("leaves a token the foundation does not define to the theme that states it", () => {
    const other: ThemeVariant = { tokens: { fonts: { mono: { value: "monospace" } } } };

    expect(completed(FORGE, FOUNDATION, stated([FORGE, other])).tokens).toStrictEqual({
      radii: { l1: { value: "8px" } },
    });
  });

  it("returns the variant as it is where the foundation extends nothing", () => {
    expect(
      completed(FORGE, { name: "@acme/bare", theme: {} }, stated([FOLIO, FORGE])),
    ).toStrictEqual(FORGE);
  });
});
