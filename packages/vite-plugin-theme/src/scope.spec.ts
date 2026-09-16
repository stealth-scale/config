import { describe, expect, it } from "vitest";

import { scopedPreset, scopedPresets, type Switchable, type SwitchablePreset } from "#scope.ts";

const ABYSS = "[data-theme=abyss] &";

function theme(name: string, extend?: Record<string, unknown>): Switchable {
  return { name, ...(extend === undefined ? {} : { preset: { theme: { extend } } }) };
}

function derived(
  name: string,
  under: SwitchablePreset,
  extend: Record<string, unknown> = {},
): Switchable {
  return {
    name,
    preset: { name: `@stealthscale/theme-${name}`, presets: [under], theme: { extend } },
  };
}

const FATHOM: SwitchablePreset = {
  name: "@stealthscale/theme-fathom",
  theme: { extend: { recipes: { button: { base: { gap: "3" } } } } },
};

describe("scope", () => {
  it("returns no preset for a theme that extends nothing", () => {
    expect(scopedPreset(theme("abyss"))).toStrictEqual([]);
  });

  it("returns no preset for a preset that states no additions", () => {
    expect(
      scopedPreset({ name: "abyss", preset: { name: "@stealthscale/theme-abyss" } }),
    ).toStrictEqual([]);
  });

  it("names the preset after the theme it scopes", () => {
    const scoped = scopedPreset(theme("abyss", { recipes: { button: {} } }));

    expect(scoped).toMatchObject([{ name: "@stealthscale/theme-abyss-switched" }]);
  });

  it("nests a variant's styles under the attribute that switches to the theme", () => {
    const scoped = scopedPreset(
      theme("abyss", {
        recipes: { button: { variants: { variant: { solid: { letterSpacing: "0.06em" } } } } },
      }),
    );

    expect(scoped).toStrictEqual([
      {
        name: "@stealthscale/theme-abyss-switched",
        theme: {
          extend: {
            recipes: {
              button: {
                variants: { variant: { solid: { [ABYSS]: { letterSpacing: "0.06em" } } } },
              },
            },
          },
        },
      },
    ]);
  });

  it("nests what an extension states for every instance", () => {
    const scoped = scopedPreset(theme("abyss", { recipes: { button: { base: { gap: "3" } } } }));

    expect(scoped).toMatchObject([
      { theme: { extend: { recipes: { button: { base: { [ABYSS]: { gap: "3" } } } } } } },
    ]);
  });

  it("nests inside each slot of a slot recipe rather than around the slot map", () => {
    const scoped = scopedPreset(
      theme("abyss", {
        slotRecipes: { dialog: { base: { backdrop: { backdropFilter: "blur(6px)" } } } },
      }),
    );

    expect(scoped).toMatchObject([
      {
        theme: {
          extend: {
            slotRecipes: {
              dialog: { base: { backdrop: { [ABYSS]: { backdropFilter: "blur(6px)" } } } },
            },
          },
        },
      },
    ]);
  });

  it("leaves a slot value that is not a style object as it is", () => {
    const scoped = scopedPreset(
      theme("abyss", { slotRecipes: { dialog: { base: { backdrop: "unexpected" } } } }),
    );

    expect(scoped).toMatchObject([
      { theme: { extend: { slotRecipes: { dialog: { base: { backdrop: "unexpected" } } } } } },
    ]);
  });

  it("nests each slot of a slot recipe's variant", () => {
    const scoped = scopedPreset(
      theme("abyss", {
        slotRecipes: { dialog: { variants: { size: { lg: { content: { padding: "8" } } } } } },
      }),
    );

    expect(scoped).toMatchObject([
      {
        theme: {
          extend: {
            slotRecipes: {
              dialog: { variants: { size: { lg: { content: { [ABYSS]: { padding: "8" } } } } } },
            },
          },
        },
      },
    ]);
  });

  it("keeps the axes a compound variant matches on and nests the styles it applies", () => {
    const scoped = scopedPreset(
      theme("abyss", {
        recipes: {
          button: {
            compoundVariants: [{ css: { fontWeight: "bold" }, size: "lg", variant: "solid" }],
          },
        },
      }),
    );

    expect(scoped).toMatchObject([
      {
        theme: {
          extend: {
            recipes: {
              button: {
                compoundVariants: [
                  { css: { [ABYSS]: { fontWeight: "bold" } }, size: "lg", variant: "solid" },
                ],
              },
            },
          },
        },
      },
    ]);
  });

  it("leaves a compound variant that states no styles as it is", () => {
    const scoped = scopedPreset(
      theme("abyss", { recipes: { button: { compoundVariants: [{ size: "lg" }] } } }),
    );

    expect(scoped).toMatchObject([
      { theme: { extend: { recipes: { button: { compoundVariants: [{ size: "lg" }] } } } } },
    ]);
  });

  it("states nothing an extension did not state", () => {
    const [scoped] = scopedPreset(theme("abyss", { recipes: { button: { base: { gap: "3" } } } }));

    expect(Object.keys(scoped ?? {})).toStrictEqual(["name", "theme"]);
    expect(Object.keys(scoped?.theme.extend ?? {})).toStrictEqual(["recipes"]);
  });

  it("scopes the parent's extensions under the child's attribute ahead of the child's own", () => {
    const scoped = scopedPreset(
      derived("abyss", FATHOM, { recipes: { button: { base: { gap: "4" } } } }),
    );

    expect(scoped).toStrictEqual([
      {
        name: "@stealthscale/theme-abyss-switched from @stealthscale/theme-fathom",
        theme: { extend: { recipes: { button: { base: { [ABYSS]: { gap: "3" } } } } } },
      },
      {
        name: "@stealthscale/theme-abyss-switched",
        theme: { extend: { recipes: { button: { base: { [ABYSS]: { gap: "4" } } } } } },
      },
    ]);
  });

  it("scopes the parent's extensions when the child states none of its own", () => {
    expect(scopedPreset(derived("abyss", FATHOM))).toMatchObject([
      { name: "@stealthscale/theme-abyss-switched from @stealthscale/theme-fathom" },
    ]);
  });

  it("reaches every ancestor with the oldest first", () => {
    const parent: SwitchablePreset = {
      name: "@stealthscale/theme-deep",
      presets: [FATHOM],
      theme: { extend: { recipes: { button: { base: { gap: "5" } } } } },
    };

    expect(scopedPreset(derived("abyss", parent)).map((each) => each.name)).toStrictEqual([
      "@stealthscale/theme-abyss-switched from @stealthscale/theme-fathom",
      "@stealthscale/theme-abyss-switched from @stealthscale/theme-deep",
    ]);
  });

  it("passes over an ancestor that extends nothing", () => {
    const quiet: SwitchablePreset = { name: "@stealthscale/theme-quiet", theme: { extend: {} } };
    const scoped = scopedPreset(derived("abyss", quiet, { recipes: { button: {} } }));

    expect(scoped.map((each) => each.name)).toStrictEqual(["@stealthscale/theme-abyss-switched"]);
  });

  it("names an ancestor that has no name", () => {
    const unnamed: SwitchablePreset = { theme: { extend: { recipes: { button: {} } } } };

    expect(scopedPreset(derived("abyss", unnamed))[0]?.name).toBe(
      "@stealthscale/theme-abyss-switched from an unnamed preset",
    );
  });

  it("passes over a preset nested by name", () => {
    const stated: Switchable = {
      name: "abyss",
      preset: {
        presets: ["@pandacss/preset-base"],
        theme: { extend: { recipes: { button: {} } } },
      },
    };

    expect(scopedPreset(stated)).toHaveLength(1);
  });

  it("returns no preset when there is no theme", () => {
    expect(scopedPresets([])).toStrictEqual([]);
  });

  it("scopes every theme that extends anything with the first theme included", () => {
    const stated = [
      theme("fathom", { recipes: { button: {} } }),
      theme("abyss", { recipes: { button: { base: { gap: "3" } } } }),
      theme("forge"),
    ];

    expect(scopedPresets(stated).map((each) => each.name)).toStrictEqual([
      "@stealthscale/theme-fathom-switched",
      "@stealthscale/theme-abyss-switched",
    ]);
  });

  it("carries what a derived theme inherits beside its own under the one attribute", () => {
    const stated = [derived("abyss", FATHOM, { recipes: { button: { base: { gap: "4" } } } })];

    expect(scopedPresets(stated).map((each) => each.name)).toStrictEqual([
      "@stealthscale/theme-abyss-switched from @stealthscale/theme-fathom",
      "@stealthscale/theme-abyss-switched",
    ]);
  });
});
