import { describe, expect, it } from "vitest";

import { readBack } from "#core.fixtures.ts";
import { configuring } from "#defaults.ts";
import { preset } from "#layer.ts";

/**
 * Where the config under specification is, which every `defineConfig` states for itself.
 */
const AT = import.meta.dirname;

/**
 * A `defineConfig` carrying one default, for testing the binding itself.
 */
const defineConfig = configuring(() => [
  preset({ config: { mode: "from-default", publicDir: "held" }, name: "a-default" }),
]);

describe("defaults", () => {
  it("applies its defaults when the caller extends nothing", async () => {
    expect((await readBack(defineConfig(AT, {}))).publicDir).toBe("held");
  });

  it("applies its defaults when the caller passes nothing", async () => {
    expect((await readBack(defineConfig(AT))).publicDir).toBe("held");
  });

  it("puts them beneath what the caller extends", async () => {
    const held = await readBack(
      defineConfig(AT, { extends: [preset({ config: { mode: "from-caller" }, name: "theirs" })] }),
    );

    expect(held.mode).toBe("from-caller");
  });

  it("keeps what the caller extends as well as the defaults", async () => {
    const held = await readBack(
      defineConfig(AT, { extends: [preset({ config: { base: "/theirs/" }, name: "theirs" })] }),
    );

    expect(held).toMatchObject({ base: "/theirs/", publicDir: "held" });
  });

  it("lets the caller's own keys override a default", async () => {
    expect((await readBack(defineConfig(AT, { mode: "from-own-keys" }))).mode).toBe(
      "from-own-keys",
    );
  });

  it("takes a function", async () => {
    const held = await readBack(
      defineConfig(AT, ({ command }) => ({ base: command === "build" ? "/built/" : "/served/" })),
    );

    expect(held).toMatchObject({ base: "/built/", publicDir: "held" });
  });

  it("takes a promise", async () => {
    const held = await readBack(defineConfig(AT, Promise.resolve({ base: "/awaited/" })));

    expect(held).toMatchObject({ base: "/awaited/", publicDir: "held" });
  });
});
