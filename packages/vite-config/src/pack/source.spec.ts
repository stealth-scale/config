import { globSync, readFileSync } from "node:fs";
import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { source } from "#pack/source.ts";
import { SOURCE } from "#resolve/condition.ts";

interface Packaged {
  files?: string[];
  publishConfig?: { exports: Record<string, string> };
}

function packaged(): ReadonlyArray<readonly [string, Packaged]> {
  const at = new URL("../../..", import.meta.url).pathname;

  return globSync("*/package.json", { cwd: at }).map(
    (held) => [held, JSON.parse(readFileSync(`${at}/${held}`, "utf8")) as Packaged] as const,
  );
}

describe("source", () => {
  it("tells the packer which condition resolves a package to its source", () => {
    const held = (source().config as UserConfig).pack as { exports: { devExports: string } };

    expect(held.exports.devExports).toBe(SOURCE);
  });

  const ALWAYS = ["package.json"];

  it("ships whatever the published map points at in every published package", () => {
    for (const [name, held] of packaged()) {
      for (const [subpath, path] of Object.entries(held.publishConfig?.exports ?? {})) {
        const named = path.replace("./", "");
        const top = named.split("/")[0] ?? "";
        const files = [...(held.files ?? []), ...ALWAYS];

        expect(
          files.some((file) => file === top || file === named),
          `${name} publishes ${subpath} from ${named}, which it does not ship`,
        ).toBe(true);
      }
    }
  });

  it("names the source condition in what a workspace reads and not in what is published", () => {
    for (const [name, held] of packaged()) {
      for (const path of Object.values(held.publishConfig?.exports ?? {})) {
        expect(path, `${name} publishes a path into its own source`).not.toContain("src/");
      }
    }
  });

  it("discovers the packages rather than being given them", () => {
    const held = packaged().filter(([, one]) => one.publishConfig !== undefined);

    expect(held.length).toBeGreaterThan(1);
  });
});
