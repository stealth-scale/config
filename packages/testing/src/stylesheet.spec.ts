import { describe, expect, it } from "vitest";

import { declared } from "#stylesheet.ts";

const CSS = `
@layer tokens {
  :where(:root, :host) {
    --colors-bg: white;
    --colors-fg: black;
  }
  @media (prefers-color-scheme: dark) {
    :where(:root, :host):not([data-color-mode=light], [data-color-mode=light] *) {
      --colors-bg: near-black;
    }
    :where(:root) [data-theme=abyss], [data-theme=abyss]:where(:root), [data-theme=abyss] :where(:root) {
      --colors-bg: deep;
    }
  }
}
@layer recipes {
  .button { border-radius: var(--radii-l2) }
  .button--size-lg { padding: 1rem }
}
`;

describe("declared", () => {
  it("reads what a selector declares a property as", () => {
    expect(declared(CSS, ":where(:root, :host)", "--colors-bg")).toBe("white");
    expect(declared(CSS, ".button", "border-radius")).toBe("var(--radii-l2)");
  });

  it("reads a selector that carries the characters a pattern reads as syntax", () => {
    expect(
      declared(
        CSS,
        ":where(:root, :host):not([data-color-mode=light], [data-color-mode=light] *)",
        "--colors-bg",
      ),
    ).toBe("near-black");
  });

  it("reads a selector wherever it sits in a list", () => {
    expect(declared(CSS, "[data-theme=abyss]:where(:root)", "--colors-bg")).toBe("deep");
    expect(declared(CSS, "[data-theme=abyss] :where(:root)", "--colors-bg")).toBe("deep");
  });

  it("returns nothing for a selector that declares the property nowhere", () => {
    expect(declared(CSS, ".button", "color")).toBeUndefined();
    expect(declared(CSS, ".missing", "color")).toBeUndefined();
  });

  it("does not read a property out of a rule a longer selector opens", () => {
    expect(declared(CSS, ".button--size", "padding")).toBeUndefined();
  });
});
