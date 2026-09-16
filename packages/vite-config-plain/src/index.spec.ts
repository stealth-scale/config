import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { defineConfig } from "@stealthscale/vite-config/preset/node";

import { plain } from "#index.ts";

async function tier(): Promise<UserConfig> {
  const exported = defineConfig(new URL("..", import.meta.url).pathname);

  if (typeof exported !== "function") {
    throw new TypeError("the node tier is not a function of the environment");
  }

  const composed = await exported({ command: "build", mode: "production" });

  return composed;
}

function one<Block>(held: Block | Block[] | undefined): Block {
  if (held === undefined || Array.isArray(held)) {
    throw new TypeError("expected one block");
  }

  return held;
}

describe("vite-config-plain", () => {
  it("publishes its source under the condition the shared tsconfig switches on", () => {
    const at = createRequire(import.meta.url).resolve(
      "@stealthscale/vite-config-typescript/base.json",
    );
    const options = (JSON.parse(readFileSync(at, "utf8")) as { compilerOptions: unknown })
      .compilerOptions;

    expect(options).toMatchObject({ customConditions: ["stealth-source"] });
    expect(plain.pack).toMatchObject({ exports: { devExports: "stealth-source" } });
  });

  it("composes what the node tier composes apart from the bill of materials and coverage", async () => {
    const held = await tier();
    const composed = one(held.pack);

    expect({ ...composed, exports: undefined }).toStrictEqual({
      ...one(plain.pack),
      attw: composed.attw,
      exports: undefined,
      plugins: composed.plugins,
    });
    expect(composed.exports).toMatchObject({ devExports: "stealth-source" });
    expect(held.test).toStrictEqual({ ...plain.test, coverage: held.test?.coverage });
    expect(held.resolve).toStrictEqual(plain.resolve);
    expect(held.ssr).toStrictEqual(plain.ssr);
  });

  it("packs the barrel as one entry with its declarations checked", () => {
    expect(one(plain.pack)).toMatchObject({
      attw: true,
      dts: true,
      entry: { index: "src/index.ts" },
      publint: true,
    });
  });

  it("reads its own workspace as source on both sides", () => {
    expect(plain.resolve?.conditions?.[0]).toBe("stealth-source");
    expect(plain.ssr?.resolve?.conditions?.[0]).toBe("stealth-source");
  });
});
