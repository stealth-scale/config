import { type ConfigEnv, type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { defineConfig } from "#core/define.ts";
import { contribute, override, preset, remove } from "#core/layer.ts";

/**
 * The environment a build is read in.
 */
const BUILDING: ConfigEnv = { command: "build", mode: "production" };

/**
 * Reads a defined config back, the way Vite+ does.
 *
 * `defineConfig` answers whatever Vite+ takes, which for a config composed of layers is always a
 * function of the environment. Calling it is what a specification has to do to see the result.
 *
 * @param config - What was defined.
 * @param env - The environment to read it in.
 * @returns The composed config.
 */
function readBack(
  config: Parameters<typeof defineConfig>[0],
  env: ConfigEnv = BUILDING,
): Promise<UserConfig> {
  const held = defineConfig(config) as (given: ConfigEnv) => Promise<UserConfig>;

  return held(env);
}

test("composes the layers it extends", async () => {
  const held = await readBack({ extends: [preset({ config: { mode: "from-layer" }, name: "a" })] });

  expect(held.mode).toBe("from-layer");
});

test("lets what is written beside `extends` win over what is in it", async () => {
  const held = await readBack({
    extends: [preset({ config: { mode: "from-layer" }, name: "a" })],
    mode: "from-own-keys",
  });

  expect(held.mode).toBe("from-own-keys");
});

test("keeps `extends` out of the config it answers", async () => {
  const held = await readBack({ extends: [preset({ config: {}, name: "a" })], mode: "test" });

  expect(held).not.toHaveProperty("extends");
});

test("takes a function, and hands it the environment", async () => {
  const held = await readBack(({ command }) => ({
    mode: command === "build" ? "built" : "served",
  }));

  expect(held.mode).toBe("built");
});

test("takes a promise", async () => {
  expect((await readBack(Promise.resolve({ mode: "awaited" }))).mode).toBe("awaited");
});

test("composes with nothing extended", async () => {
  expect((await readBack({ mode: "alone" })).mode).toBe("alone");
});

test("leaves out a layer that does not take part in this environment", async () => {
  const held = await readBack({
    extends: [preset({ apply: "serve", config: { mode: "serving" }, name: "a" })],
  });

  expect(held.mode).toBeUndefined();
});

test("appends what a contribution contributes, and takes back what a removal names", async () => {
  const held = await readBack({
    extends: [
      contribute({ at: "test.setupFiles", because: "b", item: "./a.ts", name: "a" }),
      contribute({ at: "test.setupFiles", because: "b", item: "./b.ts", name: "b" }),
      remove({ because: "b", name: "without(b)", target: "b" }),
    ],
  });

  expect(held).toMatchObject({ test: { setupFiles: ["./a.ts"] } });
});

test("runs an override after everything else", async () => {
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

test("flattens a builder that answers several layers", async () => {
  const several = [
    preset({ config: { mode: "one" }, name: "one" }),
    preset({ config: { publicDir: "two" }, name: "two" }),
  ];
  const held = await readBack({ extends: [several] });

  expect(held).toMatchObject({ mode: "one", publicDir: "two" });
});
