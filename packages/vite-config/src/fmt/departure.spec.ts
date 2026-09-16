import { describe, expect, it } from "vitest";

import { defineConfig, preset } from "@stealthscale/vite-config-core";

import { generated, group, own, skip } from "#fmt/departure.ts";
import { imports } from "#fmt/imports.ts";
import { GENERATED } from "#ignore/generated.ts";
import { readBack } from "#preset/preset.fixtures.ts";

/**
 * Where the config under specification is, which every `defineConfig` states for itself.
 */
const AT = import.meta.dirname;

/**
 * Reads the import settings back once the layers have composed.
 *
 * @param layers - What a repository extends.
 * @returns Those settings.
 */
async function sorted(layers: readonly unknown[]): Promise<Record<string, unknown>> {
  const held = await readBack(defineConfig(AT, { extends: layers as never }));

  return held.fmt?.sortImports as Record<string, unknown>;
}

describe("departure", () => {
  it("contributes one glob at a time", () => {
    const held = skip({ because: "vendored", files: ["a/**", "b/**"] });

    expect(held.map((one) => one.item)).toStrictEqual(["a/**", "b/**"]);
  });

  it("names each contribution for the glob it skips", () => {
    expect(skip({ because: "vendored", files: ["a/**"] })[0]?.name).toBe("fmt.skip(a/**)");
  });

  it("appends rather than replaces", () => {
    for (const held of skip({ because: "vendored", files: ["a/**"] })) {
      expect(held.at).toBe("fmt.ignorePatterns");
    }
  });

  it("keeps the reason with the contribution", () => {
    expect(skip({ because: "vendored", files: ["a/**"] })[0]?.because).toBe("vendored");
  });

  it("leaves alone exactly what every other tool walks past", () => {
    expect(generated().map((one) => one.item)).toStrictEqual([...GENERATED]);
  });

  it("counts another scope as internal alongside the house default", async () => {
    const held = await sorted([imports(), ...own({ because: "ours", patterns: ["@acme/"] })]);

    expect(held["internalPattern"]).toStrictEqual(["@stealthscale/", "@acme/"]);
  });

  it("names each owned scope and keeps the reason with it", () => {
    const [held] = own({ because: "a second scope", patterns: ["@acme/"] });

    expect(held?.name).toBe("fmt.own(@acme/)");
    expect(held?.because).toBe("a second scope");
  });

  it("puts a contributed group at the top of the order", async () => {
    const held = await sorted([
      imports(),
      group({ because: "renders", name: "react", patterns: ["^react$"] }),
    ]);

    expect((held["groups"] as string[])[0]).toBe("react");
  });

  it("defines the group as well as naming it", async () => {
    const held = await sorted([
      imports(),
      group({ because: "renders", name: "react", patterns: ["^react$"] }),
    ]);
    const defined = held["customGroups"] as Array<{
      elementNamePattern: string[];
      groupName: string;
    }>;

    expect(defined[0]).toStrictEqual({ elementNamePattern: ["^react$"], groupName: "react" });
  });

  it("keeps the order it was given underneath", async () => {
    const held = await sorted([
      imports(),
      group({ because: "renders", name: "react", patterns: ["^react$"] }),
    ]);

    expect((held["groups"] as unknown[]).at(-1)).toBe("unknown");
  });

  it("lets two modules each add a group and keeps both defined", async () => {
    const held = await sorted([
      imports(),
      group({ because: "renders", name: "react", patterns: ["^react$"] }),
      group({ because: "routes", name: "router", patterns: ["^@tanstack/"] }),
    ]);
    const defined = held["customGroups"] as Array<{ groupName: string }>;

    expect(defined.map((one) => one.groupName).toSorted()).toStrictEqual(["react", "router"]);
    expect(held["groups"]).toContain("react");
    expect(held["groups"]).toContain("router");
  });

  it("throws when nothing above it sorts imports", async () => {
    await expect(
      sorted([group({ because: "renders", name: "react", patterns: ["^react$"] })]),
    ).rejects.toThrow("nothing above it sorts imports");
  });

  it("adds the first group where nothing has defined one yet", async () => {
    const held = await readBack(
      defineConfig(AT, {
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
});
