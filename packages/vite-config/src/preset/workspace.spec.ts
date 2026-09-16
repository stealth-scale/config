import { describe, expect, it } from "vitest";

import { type Layer } from "@stealthscale/vite-config-core";

import { readBack } from "#preset/preset.fixtures.ts";
import { defineConfig, layers } from "#preset/workspace.ts";

/**
 * Where the config under specification is: this package's own root.
 *
 * A config file sits at a package root, and the tier reads the manifest beside it. Naming this
 * directory instead would hand the layers a directory holding no manifest at all.
 */
const AT = new URL("../..", import.meta.url).pathname;

/**
 * Names every layer the tier hands over.
 *
 * @returns Each name, flattened.
 */
function names(): string[] {
  const flat: Layer[] = layers().flatMap((held) =>
    Array.isArray(held) ? (held as Layer[]) : [held as Layer],
  );

  return flat.map((one) => one.name);
}

describe("workspace", () => {
  it("declares what the task runner reads once for the whole tree", () => {
    const held = names();

    expect(held).toContain("run.cache");
    expect(held).toContain("run.ci");
  });

  it("declares what happens before a commit", () => {
    const held = names();

    expect(held).toContain("staged.checked");
    expect(held).toContain("staged.formatted");
  });

  it("declares the projects", () => {
    expect(names()).toContain("test.projects");
  });

  it("takes the node tier underneath", () => {
    const held = names();

    expect(held).toContain("lint.node");
    expect(held).toContain("pack.published");
  });

  it("leaves the layer names unowned", () => {
    for (const name of names()) {
      const [path] = name.split("(");

      expect(path, `${name} carries an owner`).not.toContain("/");
    }
  });

  it("binds the layers into one defineConfig", async () => {
    const held = await readBack(defineConfig(AT, {}));

    expect(held.run?.tasks).toHaveProperty("ci");
    expect(held.staged).toBeDefined();
  });
});
