import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { configured, declared, hookContext, started, transformed } from "@stealthscale/testing";
import { theme } from "@stealthscale/vite-plugin-theme";

import statement from "./theme.config.ts";

const DECLARED = "@layer reset, base, tokens, recipes, utilities;\n";

const CONDITIONS = ["stealth-source", "node"];

async function compile(): Promise<string> {
  const plugin = theme.stylesheet();
  const context = hookContext();

  await configured(plugin, {
    root: import.meta.dirname,
    ssr: { resolve: { conditions: CONDITIONS } },
  });
  await started(plugin, context);

  return (
    (await transformed(plugin, context, DECLARED, join(import.meta.dirname, "styles.css"))) ?? ""
  );
}

const css = await compile();

describe("theme.config", () => {
  it("lists fathom alone", () => {
    expect(statement.themes.map((each) => each.name)).toStrictEqual(["fathom"]);
  });

  it("compiles the theme's page color where no attribute is set", () => {
    expect(declared(css, ":where(:root, :host)", "--colors-bg")).toBe("oklch(96.0% 0.0160 195.0)");
  });

  it("compiles the theme under its attribute as well", () => {
    expect(declared(css, "[data-theme=fathom]", "--colors-bg")).toBe("oklch(96.0% 0.0160 195.0)");
  });

  it("compiles the dark values under the color mode attribute", () => {
    expect(css).toContain("[data-color-mode=dark]");
    expect(css).toContain("oklch(11.0% 0.0160 195.0)");
  });

  it("compiles the button recipe the component package publishes", () => {
    expect(declared(css, ".button", "border-radius")).toBe("var(--radii-l2)");
    expect(css).toContain(".button--variant-outline");
  });

  it("names the compiler nowhere in the stylesheet", () => {
    expect(css).not.toContain("panda");
  });
});
