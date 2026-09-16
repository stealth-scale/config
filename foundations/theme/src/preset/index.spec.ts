import { describe, expect, it } from "vitest";

import { HUES, type Mode, MODES, PALETTES } from "#authoring/contract.ts";
import { contrast } from "#authoring/contrast.ts";
import { foundation } from "#preset/index.ts";
import { semanticTokens } from "#preset/semantic-tokens/index.ts";
import { tokens } from "#preset/tokens/index.ts";
import { tokenAt } from "#tokens.fixtures.ts";

const TEXT = 7;

const BOUNDARY = 3;

const SURFACES = ["bg", "bg.subtle", "bg.muted", "bg.emphasized", "bg.panel", "bg.popover"];

const INKS = ["fg", "fg.muted", "fg.info", "fg.success", "fg.warning", "fg.error"];

const EVERY_PALETTE = [...HUES, ...PALETTES];

function stated(path: string): unknown {
  const node = tokenAt(semanticTokens.colors, path);

  return typeof node === "object" && node !== null && "DEFAULT" in node
    ? tokenAt(node, "DEFAULT")
    : node;
}

function colorAt(path: string, mode: Mode): string {
  const value = stated(path);
  const chosen: unknown =
    typeof value === "object" && value !== null ? Reflect.get(value, mode) : value;

  if (typeof chosen === "string") {
    return chosen.startsWith("{colors.") ? colorAt(chosen.slice(8, -1), mode) : chosen;
  }

  return String(tokenAt(tokens.colors, path));
}

function failing(pairs: ReadonlyArray<readonly [string, string]>, minimum: number): string[] {
  return MODES.flatMap((mode) =>
    pairs.flatMap(([front, back]) => {
      const measured = contrast(colorAt(front, mode), colorAt(back, mode));

      return measured >= minimum
        ? []
        : [
            `${front} on ${back} measures ${measured.toFixed(2)} in ${mode}, below ${String(minimum)}`,
          ];
    }),
  );
}

function onSurfaces(fronts: readonly string[]): Array<readonly [string, string]> {
  return fronts.flatMap((front) => SURFACES.map((back) => [front, back] as const));
}

function perPalette(
  roles: ReadonlyArray<readonly [string, string]>,
): Array<readonly [string, string]> {
  return EVERY_PALETTE.flatMap((palette) =>
    roles.map(
      ([front, back]) =>
        [`${palette}.${front}`, back === "bg" ? back : `${palette}.${back}`] as const,
    ),
  );
}

describe("foundation", () => {
  it("names the package that publishes it", () => {
    expect(foundation.name).toBe("@stealthscale/theme");
  });

  it("holds no recipe", () => {
    expect(foundation.theme?.extend?.recipes).toBeUndefined();
    expect(foundation.theme?.extend?.slotRecipes).toBeUndefined();
  });

  it("names no preset beneath it", () => {
    expect(foundation.presets).toBeUndefined();
  });

  it("adds to each section rather than replacing it", () => {
    expect(Object.keys(foundation.theme ?? {})).toStrictEqual(["extend"]);
    expect(Object.keys(foundation.theme?.extend ?? {}).toSorted()).toStrictEqual([
      "animationStyles",
      "breakpoints",
      "containers",
      "keyframes",
      "layerStyles",
      "semanticTokens",
      "textStyles",
      "tokens",
    ]);
  });

  it("states the conditions and the utilities and the global styles", () => {
    expect(foundation.conditions).toBeDefined();
    expect(foundation.utilities).toBeDefined();
    expect(foundation.globalCss).toBeDefined();
  });

  it("clears the text ratio for every ink on every surface", () => {
    expect(failing(onSurfaces(INKS), TEXT)).toStrictEqual([]);
  });

  it("clears the text ratio for every palette's inks on its fills", () => {
    expect(
      failing(
        perPalette([
          ["contrast", "solid"],
          ["contrast", "solid.hover"],
          ["fg", "subtle"],
          ["fg", "muted"],
          ["fg", "emphasized"],
          ["fg", "bg"],
          ["fg.muted", "subtle"],
          ["fg.muted", "muted"],
          ["fg.muted", "emphasized"],
        ]),
        TEXT,
      ),
    ).toStrictEqual([]);
  });

  it("clears the boundary ratio for the emphasized line and the subtle ink on every surface", () => {
    expect(failing(onSurfaces(["border.emphasized", "fg.subtle"]), BOUNDARY)).toStrictEqual([]);
  });

  it("clears the boundary ratio for every palette's solid and lines on the page", () => {
    expect(
      failing(
        perPalette([
          ["solid", "bg"],
          ["border", "bg"],
          ["border.hover", "bg"],
        ]),
        BOUNDARY,
      ),
    ).toStrictEqual([]);
  });

  it("clears the boundary ratio for every palette's ring on every surface", () => {
    expect(
      failing(
        EVERY_PALETTE.flatMap((palette) => onSurfaces([`${palette}.focusRing`])),
        BOUNDARY,
      ),
    ).toStrictEqual([]);
  });
});
