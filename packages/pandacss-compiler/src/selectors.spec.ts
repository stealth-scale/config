import { parse } from "postcss";
import selectorParser from "postcss-selector-parser";
import { describe, expect, it } from "vitest";

import { type CompilerConfig } from "@stealthscale/pandacss-naming";

import { renameSelectors } from "#selectors.ts";

const CONFIG: CompilerConfig = {
  recipes: [
    { axes: ["loading", "size"], className: "button" },
    { axes: ["bleed"], className: "card", slots: ["content", "root"] },
  ],
  separator: "-",
};

function classesOf(css: string): string[] {
  const found: string[] = [];
  const collect = selectorParser((selectors) => {
    selectors.walkClasses((node) => {
      found.push(node.value);
    });
  });

  parse(css).walkRules((rule) => {
    if (rule.selector.includes(".")) collect.processSync(rule.selector);
  });

  return found;
}

describe("renameSelectors", () => {
  it("renames a variant selector", () => {
    const { css } = renameSelectors(".button--size-lg { padding: 8px }", CONFIG);

    expect(css).toBe(".button--lg { padding: 8px }");
  });

  it("renames a class under a theme attribute", () => {
    const { css } = renameSelectors("[data-theme=abyss] .button--size-lg { padding: 8px }", CONFIG);

    expect(css).toBe("[data-theme=abyss] .button--lg { padding: 8px }");
  });

  it("renames a boolean variant at true to the axis", () => {
    const { css } = renameSelectors(".button--loading-true { opacity: 0.5 }", CONFIG);

    expect(css).toBe(".button--loading { opacity: 0.5 }");
  });

  it("removes the rule for a boolean variant at false", () => {
    const { css } = renameSelectors(
      ".button--loading-false { opacity: 1 }\n.button { color: red }",
      CONFIG,
    );

    expect(css).toBe(".button { color: red }");
  });

  it("removes only the unreachable selector of a selector list", () => {
    const { css } = renameSelectors(
      ".button--loading-false, .card__content--bleed-true { margin: 0 }",
      CONFIG,
    );

    expect(css).toBe(".card__content--bleed { margin: 0 }");
  });

  it("removes a selector that descends from a class no element carries", () => {
    const { css } = renameSelectors(
      ".button--loading-false .icon { opacity: 1 }\n.button { color: red }",
      CONFIG,
    );

    expect(css).toBe(".button { color: red }");
  });

  it("removes only the unreachable selector inside a selector list pseudo-class", () => {
    const { css } = renameSelectors(
      ":is(.button--size-lg, .button--loading-false) { opacity: 1 }",
      CONFIG,
    );

    expect(css).toBe(":is(.button--lg) { opacity: 1 }");
  });

  it("removes a selector whose list pseudo-class matches nothing", () => {
    const { css } = renameSelectors(
      ":where(.button--loading-false) { opacity: 1 }\n.button:has(.button--loading-false) { opacity: 1 }\n.button { color: red }",
      CONFIG,
    );

    expect(css).toBe(".button { color: red }");
  });

  it("writes a negation of a class no element carries as everything", () => {
    const { css } = renameSelectors(
      ":not(.button--loading-false) { opacity: 1 }\n:not(.button--loading-false) > .button { opacity: 1 }\n.button:not(.button--loading-false, .button--size-sm) { opacity: 1 }",
      CONFIG,
    );

    expect(css).toBe(
      "* { opacity: 1 }\n* > .button { opacity: 1 }\n.button:not(.button--sm) { opacity: 1 }",
    );
  });

  it("removes a negation of a class no element carries from a compound selector", () => {
    const { css } = renameSelectors(
      ".button > :not(.button--loading-false):hover { opacity: 1 }\n.button:not(.button--loading-false) { opacity: 1 }",
      CONFIG,
    );

    expect(css).toBe(".button > :hover { opacity: 1 }\n.button { opacity: 1 }");
  });

  it("leaves a selector an earlier removal took away as it is", () => {
    const { css } = renameSelectors(
      ".button--loading-false .card__content--bleed-false { opacity: 1 }\n:is(.button--loading-false .card__content--bleed-false) { opacity: 1 }\n.button { color: red }",
      CONFIG,
    );

    expect(css).toBe(".button { color: red }");
  });

  it("removes a block the removal leaves empty and keeps a layer statement", () => {
    const { css } = renameSelectors(
      "@layer a, b;\n@layer a { @media (min-width: 40rem) { .button--loading-false { opacity: 1 } } }\n@layer b { .button { color: red } }",
      CONFIG,
    );

    expect(css).toBe("@layer a, b;\n@layer b { .button { color: red } }");
  });

  it("renames an atomic class and escapes the name it writes", () => {
    const { css } = renameSelectors(
      String.raw`.\32xl\:c-blue { color: blue }` +
        "\n" +
        String.raw`.grid-ar-\{sizes\.32\} { grid-auto-rows: 8rem }`,
      CONFIG,
    );

    expect(classesOf(css)).toStrictEqual(["2xl:c-blue", "grid-ar-sizes-32"]);
    expect(css).toContain(".grid-ar-sizes-32 {");
  });

  it("renames a class inside a pseudo-class", () => {
    const { css } = renameSelectors(
      String.raw`:is(.button--size-lg, .card__root--bleed-true) :where(.textStyle-body\.md) { color: red }`,
      CONFIG,
    );

    expect(classesOf(css)).toStrictEqual(["button--lg", "card__root--bleed", "text-style-body-md"]);
  });

  it("reports the classes that rename to one name as an error", () => {
    const { diagnostics } = renameSelectors(
      String.raw`.mt--1\.5rem { margin-top: -1.5rem }` +
        "\n.mt--1-5rem { margin-top: 1px }\n.mt--1_5rem { margin-top: 2px }",
      CONFIG,
    );

    expect(diagnostics).toStrictEqual([
      {
        code: "naming/collision",
        message: "mt--1-5rem, mt--1.5rem, mt--1_5rem rename to one class, mt--1-5rem",
        severity: "error",
      },
    ]);
  });

  it("reports a class kept under a raw condition once however often it appears", () => {
    const { diagnostics } = renameSelectors(
      String.raw`.\[\&_\>_\*\]\:c-red > * { color: red }` +
        "\n" +
        String.raw`[data-theme=abyss] .\[\&_\>_\*\]\:c-red > * { color: blue }`,
      CONFIG,
    );

    expect(diagnostics).toStrictEqual([
      {
        code: "naming/raw-condition",
        help: ["[&_>_*]:c-red"],
        message:
          "1 class is kept under a raw selector or at-rule condition. A condition named in the preset is renamed.",
        severity: "warning",
      },
    ]);
  });

  it("reports the classes kept under a raw condition as one warning", () => {
    const { css, diagnostics } = renameSelectors(
      String.raw`.\[\&_\>_\*\]\:c-red > * { color: red }` +
        "\n" +
        String.raw`.\[\@media_\(min-width\:_40rem\)\]\:c-green { color: green }`,
      CONFIG,
    );

    expect(classesOf(css)).toStrictEqual(["[&_>_*]:c-red", "[@media_(min-width:_40rem)]:c-green"]);
    expect(diagnostics).toStrictEqual([
      {
        code: "naming/raw-condition",
        help: ["[&_>_*]:c-red", "[@media_(min-width:_40rem)]:c-green"],
        message:
          "2 classes are kept under a raw selector or at-rule condition. A condition named in the preset is renamed.",
        severity: "warning",
      },
    ]);
  });

  it("leaves a keyframe step and a rule without a class as they are", () => {
    const sheet =
      "@keyframes spin { from { opacity: 0 } 12.5% { opacity: 1 } }\n:where(:root, :host) { --x: 1 }";
    const { css, diagnostics } = renameSelectors(sheet, CONFIG);

    expect(css).toBe(sheet);
    expect(diagnostics).toStrictEqual([]);
  });
});
