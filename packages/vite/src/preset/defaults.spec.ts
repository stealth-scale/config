import { expect, test } from "vite-plus/test";

import { preset } from "#core/layer.ts";
import { configuring } from "#preset/defaults.ts";
import { readBack } from "#preset/preset.fixtures.ts";

/**
 * A `defineConfig` carrying one default, for testing the binding itself.
 */
const defineConfig = configuring(() => [
  preset({ config: { mode: "from-default", publicDir: "held" }, name: "a-default" }),
]);

test("carries its defaults where the caller extends nothing", async () => {
  expect((await readBack(defineConfig({}))).publicDir).toBe("held");
});

test("carries them where the caller passes nothing at all", async () => {
  expect((await readBack(defineConfig())).publicDir).toBe("held");
});

test("puts them beneath what the caller extends, so the caller's layers win", async () => {
  const held = await readBack(
    defineConfig({ extends: [preset({ config: { mode: "from-caller" }, name: "theirs" })] }),
  );

  expect(held.mode).toBe("from-caller");
});

test("keeps what the caller extends as well as the defaults", async () => {
  const held = await readBack(
    defineConfig({ extends: [preset({ config: { base: "/theirs/" }, name: "theirs" })] }),
  );

  expect(held).toMatchObject({ base: "/theirs/", publicDir: "held" });
});

test("lets the caller's own keys win over a default", async () => {
  expect((await readBack(defineConfig({ mode: "from-own-keys" }))).mode).toBe("from-own-keys");
});

test("takes a function, and hands it the environment", async () => {
  const held = await readBack(
    defineConfig(({ command }) => ({ base: command === "build" ? "/built/" : "/served/" })),
  );

  expect(held).toMatchObject({ base: "/built/", publicDir: "held" });
});

test("takes a promise", async () => {
  const held = await readBack(defineConfig(Promise.resolve({ base: "/awaited/" })));

  expect(held).toMatchObject({ base: "/awaited/", publicDir: "held" });
});
