import { expect, test } from "vite-plus/test";

import { defineConfig } from "#core/define.ts";
import { preset } from "#core/layer.ts";
import { imports } from "#fmt/imports.ts";
import { generated, group, internal, skip } from "#fmt/override.ts";
import { GENERATED } from "#ignore/generated.ts";
import { readBack } from "#preset/preset.fixtures.ts";

/**
 * Reads the import settings back once the layers have composed.
 *
 * @param layers - What a repository extends.
 * @returns Those settings.
 */
async function sorted(layers: readonly unknown[]): Promise<Record<string, unknown>> {
  const held = await readBack(defineConfig({ extends: layers as never }));

  return held.fmt?.sortImports as Record<string, unknown>;
}

test("contributes one glob at a time, so a later module can take back exactly one", () => {
  const held = skip({ because: "vendored", files: ["a/**", "b/**"] });

  expect(held.map((one) => one.item)).toEqual(["a/**", "b/**"]);
});

test("names each skipped glob for the glob it carries, which is what a removal asks for", () => {
  expect(skip({ because: "vendored", files: ["a/**"] })[0]?.name).toBe("fmt.skip(a/**)");
});

test("appends rather than replaces, so two modules can each leave a path alone", () => {
  for (const held of skip({ because: "vendored", files: ["a/**"] })) {
    expect(held.at).toBe("fmt.ignorePatterns");
  }
});

test("keeps the reason with the contribution, for whoever reads it next", () => {
  expect(skip({ because: "vendored", files: ["a/**"] })[0]?.because).toBe("vendored");
});

test("leaves alone exactly what every other tool walks past", () => {
  expect(generated().map((one) => one.item)).toEqual([...GENERATED]);
});

test("counts another scope as this repository's own, alongside the house default", async () => {
  const held = await sorted([imports(), ...internal(["@acme/"])]);

  expect(held["internalPattern"]).toEqual(["@stealthscale/", "@acme/"]);
});

test("puts a contributed group at the top of the order, above the ordinary ones", async () => {
  const held = await sorted([
    imports(),
    group({ because: "renders", name: "react", patterns: ["^react$"] }),
  ]);

  expect((held["groups"] as string[])[0]).toBe("react");
});

test("defines the group as well as naming it, since the formatter refuses one without the other", async () => {
  const held = await sorted([
    imports(),
    group({ because: "renders", name: "react", patterns: ["^react$"] }),
  ]);
  const defined = held["customGroups"] as Array<{
    elementNamePattern: string[];
    groupName: string;
  }>;

  expect(defined[0]).toEqual({ elementNamePattern: ["^react$"], groupName: "react" });
});

test("keeps the order it was given underneath, so the house still decides the rest", async () => {
  const held = await sorted([
    imports(),
    group({ because: "renders", name: "react", patterns: ["^react$"] }),
  ]);

  expect((held["groups"] as unknown[]).at(-1)).toBe("unknown");
});

test("lets two modules each add a group, and keeps both defined", async () => {
  const held = await sorted([
    imports(),
    group({ because: "renders", name: "react", patterns: ["^react$"] }),
    group({ because: "routes", name: "router", patterns: ["^@tanstack/"] }),
  ]);
  const defined = held["customGroups"] as Array<{ groupName: string }>;

  expect(defined.map((one) => one.groupName).toSorted()).toEqual(["react", "router"]);
  expect(held["groups"]).toContain("react");
  expect(held["groups"]).toContain("router");
});

test("refuses a group where nothing above it sorts imports, rather than writing a config that will not parse", async () => {
  await expect(
    sorted([group({ because: "renders", name: "react", patterns: ["^react$"] })]),
  ).rejects.toThrow("nothing above it sorts imports");
});

test("adds the first group where nothing has defined one yet", async () => {
  const held = await readBack(
    defineConfig({
      extends: [
        preset({ config: { fmt: { sortImports: {} } }, name: "bare" }),
        group({ because: "renders", name: "react", patterns: ["react"] }),
      ],
    }),
  );

  expect(held.fmt?.sortImports).toMatchObject({
    customGroups: [{ elementNamePattern: ["react"], groupName: "react" }],
    groups: ["react"],
  });
});
