import { type ConfigEnv, type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { defineConfig } from "#core/define.ts";
import { type Layer, owned, remove } from "#core/layer.ts";
import { defaultExported, forbid, relax, undocumented } from "#lint/override.ts";

/**
 * The environment a build is read in.
 */
const BUILDING: ConfigEnv = { command: "build", mode: "production" };

/**
 * Reads a defined config back, the way Vite+ does.
 *
 * @param config - What was defined.
 * @returns The composed config.
 */
function readBack(config: Parameters<typeof defineConfig>[0]): Promise<UserConfig> {
  const held = defineConfig(config) as (given: ConfigEnv) => Promise<UserConfig>;

  return held(BUILDING);
}

/**
 * Holds one override, as the specifications below read it.
 */
interface Held {
  /**
   * The globs it covers.
   */
  files: string[];

  /**
   * The rules it changes.
   */
  rules: Record<string, unknown>;
}

/**
 * Reads the overrides out of a composed config.
 *
 * @param config - The composed config.
 * @returns Its lint overrides.
 */
function overridesOf(config: UserConfig): readonly Held[] {
  return (config.lint?.overrides ?? []) as readonly Held[];
}

/**
 * Stands in for `@stealthscale/config-react`.
 *
 * @returns What that package contributes.
 */
function react(): readonly Layer[] {
  return owned("react", [
    relax({
      because: "a component file is read by its default export",
      files: ["**/*.tsx"],
      rules: { "no-default-export": "off" },
    }),
  ]);
}

/**
 * Stands in for `@stealthscale/config-paraglide`.
 *
 * @returns What that package contributes.
 */
function paraglide(): readonly Layer[] {
  return owned("paraglide", [
    relax({
      because: "the compiler writes these, so nothing here is anybody's to fix",
      files: ["**/*.tsx"],
      rules: { "max-lines": "off" },
    }),
  ]);
}

test("appends to the block's overrides rather than replacing them", () => {
  const held = forbid({ because: "a reason", files: ["core/**"], packages: ["@scope/tool-*"] });

  expect(held).toMatchObject({ at: "lint.overrides", kind: "contribution" });
});

test("refuses the patterns a tier may not reach for", () => {
  const held = forbid({ because: "a reason", files: ["core/**"], packages: ["@scope/tool-*"] });

  expect(held.item).toEqual({
    files: ["core/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [{ group: ["@scope/tool-*"], message: "a reason" }] },
      ],
    },
  });
});

test("lets an exception back in, as a negated pattern", () => {
  const held = forbid({
    because: "a reason",
    except: ["@scope/tool-fixtures"],
    files: ["core/**"],
    packages: ["@scope/tool-*"],
  });

  expect(held.item).toMatchObject({
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [{ group: ["@scope/tool-*", "!@scope/tool-fixtures"] }] },
      ],
    },
  });
});

test("carries the reason as the message the author is shown", () => {
  const held = forbid({
    because: "a tool builds on core, so core reaches for no tool",
    files: ["core/**"],
    packages: ["@scope/tool-*"],
  });

  expect(JSON.stringify(held.item)).toContain("so core reaches for no tool");
});

test("names itself by the paths it covers, so a removal can take it back", () => {
  expect(forbid({ because: "b", files: ["core/**", "themes/**"], packages: ["x"] }).name).toBe(
    "lint.forbid(core/**, themes/**)",
  );
});

test("relaxes the rules a path is held to", () => {
  const held = relax({
    because: "a config is read by its default export",
    files: ["**/*.config.ts"],
    rules: { "no-default-export": "off" },
  });

  expect(held.item).toEqual({ files: ["**/*.config.ts"], rules: { "no-default-export": "off" } });
});

test("copies what it was handed, so a caller's array is not the config's", () => {
  const files = ["x"];
  const held = relax({ because: "b", files, rules: {} });
  files.push("y");

  expect((held.item as { files: string[] }).files).toEqual(["x"]);
});

test("accumulates, in the order they were written", async () => {
  const held = await readBack({
    extends: [
      forbid({ because: "b", files: ["core/**"], packages: ["x"] }),
      relax({ because: "b", files: ["**/*.config.ts"], rules: { "no-default-export": "off" } }),
      forbid({ because: "b", files: ["themes/**"], packages: ["y"] }),
    ],
  });

  expect(overridesOf(held).map((one) => one.files)).toEqual([
    ["core/**"],
    ["**/*.config.ts"],
    ["themes/**"],
  ]);
});

test("keeps both where two cover the same paths, because the linter applies both", async () => {
  const held = await readBack({
    extends: [
      relax({ because: "one", files: ["src/**"], rules: { "no-console": "off" } }),
      relax({ because: "two", files: ["src/**"], rules: { "max-lines": "off" } }),
    ],
  });

  expect(overridesOf(held)).toHaveLength(2);
});

test("takes what several packages each contribute", async () => {
  const held = await readBack({ extends: [react(), paraglide()] });

  expect(overridesOf(held).map((one) => Object.keys(one.rules))).toEqual([
    ["no-default-export"],
    ["max-lines"],
  ]);
});

test("takes a repository's own beside them, last so it wins", async () => {
  const held = await readBack({
    extends: [
      react(),
      paraglide(),
      forbid({ because: "ours", files: ["src/**"], packages: ["@scope/tool-*"] }),
    ],
  });

  expect(overridesOf(held)).toHaveLength(3);
});

test("takes back one package's contribution by name, leaving the other's standing", async () => {
  const held = await readBack({
    extends: [
      react(),
      paraglide(),
      remove({ because: "b", name: "x", target: "react/lint.relax(**/*.tsx)" }),
    ],
  });

  expect(overridesOf(held).map((one) => Object.keys(one.rules))).toEqual([["max-lines"]]);
});

test("excuses exactly the globs it is handed, deciding none of them itself", () => {
  const held = defaultExported(["**/*.config.ts", "**/*.stories.tsx"]).item as { files: string[] };

  expect(held.files).toEqual(["**/*.config.ts", "**/*.stories.tsx"]);
});

test("turns off the rule a default export would break", () => {
  const held = defaultExported(["**/*.config.ts"]).item as { rules: Record<string, unknown> };

  expect(held.rules).toEqual({ "no-default-export": "off" });
});

test("excuses a specification exactly the globs it is handed", () => {
  const held = undocumented(["**/*.bench.ts"]).item as { files: string[] };

  expect(held.files).toEqual(["**/*.bench.ts"]);
});

test("lets a repository add its own beside the preset's, since both apply", async () => {
  const held = await readBack({
    extends: [defaultExported(["**/*.config.ts"]), defaultExported(["**/*.stories.tsx"])],
  });

  expect(overridesOf(held).map((one) => one.files)).toEqual([
    ["**/*.config.ts"],
    ["**/*.stories.tsx"],
  ]);
});
