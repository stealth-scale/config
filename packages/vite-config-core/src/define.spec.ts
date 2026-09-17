/**
 * Covers what `extends` composes and how a package's own keys land on top of it.
 */

import { type ConfigEnv, type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { defineConfig } from "#define.ts";
import { contribute, override, preset, remove } from "#layer.ts";

/**
 * The directory each config under test declares, which is this package's own source folder.
 */
const AT = import.meta.dirname;

/**
 * A production build, which is the invocation these cases are read under.
 */
const BUILDING: ConfigEnv = { command: "build", mode: "production" };

/**
 * Defines a config and invokes it, returning what the layers and the own keys settled on.
 *
 * @param config - What a package would write beside its directory.
 * @param env - The command and mode to invoke the config for.
 */
function readBack(
  config: Parameters<typeof defineConfig>[1],
  env: ConfigEnv = BUILDING,
): Promise<UserConfig> {
  const held = defineConfig(AT, config) as (given: ConfigEnv) => Promise<UserConfig>;

  return held(env);
}

describe("define", () => {
  it("composes the layers it extends", async () => {
    const held = await readBack({
      extends: [preset({ config: { mode: "from-layer" }, name: "a" })],
    });

    expect(held.mode).toBe("from-layer");
  });

  it("lets what is written beside `extends` win over what is in it", async () => {
    const held = await readBack({
      extends: [preset({ config: { mode: "from-layer" }, name: "a" })],
      mode: "from-own-keys",
    });

    expect(held.mode).toBe("from-own-keys");
  });

  it("keeps extends out of the config it returns", async () => {
    const held = await readBack({ extends: [preset({ config: {}, name: "a" })], mode: "test" });

    expect(held).not.toHaveProperty("extends");
  });

  it("takes a function and passes it the environment", async () => {
    const held = await readBack(({ command }) => ({
      mode: command === "build" ? "built" : "served",
    }));

    expect(held.mode).toBe("built");
  });

  it("takes a promise", async () => {
    expect((await readBack(Promise.resolve({ mode: "awaited" }))).mode).toBe("awaited");
  });

  it("composes with nothing extended", async () => {
    expect((await readBack({ mode: "alone" })).mode).toBe("alone");
  });

  it("leaves out a layer that does not apply in this environment", async () => {
    const held = await readBack({
      extends: [preset({ apply: "serve", config: { mode: "serving" }, name: "a" })],
    });

    expect(held.mode).toBeUndefined();
  });

  it("appends a contribution and removes what a removal names", async () => {
    const held = await readBack({
      extends: [
        contribute({ at: "test.setupFiles", because: "b", item: "./a.ts", name: "a" }),
        contribute({ at: "test.setupFiles", because: "b", item: "./b.ts", name: "b" }),
        remove({ because: "b", name: "without(b)", target: "b" }),
      ],
    });

    expect(held).toMatchObject({ test: { setupFiles: ["./a.ts"] } });
  });

  it("runs an override after everything else", async () => {
    const held = await readBack({
      extends: [
        preset({ config: { mode: "set" }, name: "a" }),
        override({
          because: "b",
          name: "tidy",
          refine: (config) => ({ ...config, mode: "refined" }),
        }),
      ],
    });

    expect(held.mode).toBe("refined");
  });

  it("flattens a builder that returns several layers", async () => {
    const several = [
      preset({ config: { mode: "one" }, name: "one" }),
      preset({ config: { publicDir: "two" }, name: "two" }),
    ];
    const held = await readBack({ extends: [several] });

    expect(held).toMatchObject({ mode: "one", publicDir: "two" });
  });
});
