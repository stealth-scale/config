import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { configured, hookContext, started, transformed } from "@stealthscale/testing";
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

function declared(selector: string, property: string): string | undefined {
  const escaped = selector.replaceAll(/[.()[\]]/gu, String.raw`\$&`);
  const pattern = new RegExp(
    `(?:^|[{}\\n])\\s*${escaped}\\s*\\{[^}]*?${property}:\\s*([^;}]+)`,
    "u",
  );

  return pattern.exec(css)?.[1]?.trim();
}

describe("theme.config", () => {
  it("lists fathom first as the default and abyss last", () => {
    expect(statement.themes.map((each) => each.name)).toStrictEqual([
      "fathom",
      "folio",
      "forge",
      "abyss",
    ]);
  });

  it("compiles the default theme's page color where no attribute is set", () => {
    expect(declared(":where(:root, :host)", "--colors-bg")).toBe("oklch(96.0% 0.0160 195.0)");
  });

  it("compiles every theme's page color under its attribute", () => {
    expect(declared("[data-theme=fathom]", "--colors-bg")).toBe("oklch(96.0% 0.0160 195.0)");
    expect(declared("[data-theme=folio]", "--colors-bg")).toBe("oklch(98.0% 0.0100 300.0)");
    expect(declared("[data-theme=forge]", "--colors-bg")).toBe("oklch(96.0% 0.0200 75.0)");
    expect(declared("[data-theme=abyss]", "--colors-bg")).toBe("oklch(93.0% 0.0200 195.0)");
  });

  it("compiles the derived theme with its parent's values under its own attribute", () => {
    expect(declared("[data-theme=abyss]", "--colors-teal-700")).toBe(
      declared("[data-theme=fathom]", "--colors-teal-700"),
    );
    expect(declared("[data-theme=abyss]", "--colors-primary-solid")).toBe(
      "var(--colors-indigo-solid)",
    );
  });

  it("compiles the button recipe the component package publishes", () => {
    expect(declared(".button", "border-radius")).toBe("var(--radii-l2)");
    expect(css).toContain(".button--variant_ghost");
  });

  it("compiles each theme's button extension under its attribute alone", () => {
    expect(declared("[data-theme=forge] .button", "text-transform")).toBe("uppercase");
    expect(declared("[data-theme=abyss] .button", "letter-spacing")).toBe(
      "var(--letter-spacings-wide)",
    );
    expect(declared(".button", "text-transform")).toBeUndefined();
  });

  it("compiles the dark values under the attribute and under the preference", () => {
    expect(css).toContain("[data-color-mode=dark]");
    expect(css).toContain("@media (prefers-color-scheme: dark)");
  });

  it("registers the angle the moving border sweeps through", () => {
    expect(css).toContain("@property --angle");
  });

  it("names the compiler nowhere in the stylesheet", () => {
    expect(css).not.toContain("panda");
  });
});
