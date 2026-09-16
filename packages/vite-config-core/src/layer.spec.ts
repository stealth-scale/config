/**
 * Covers what each constructor puts on a layer and which environments it answers to.
 */

import { describe, expect, it } from "vitest";

import { applies, contribute, named, override, owned, preset, remove } from "#layer.ts";

/**
 * A production build, which is the environment every case here is tested against.
 */
const BUILDING = { command: "build", mode: "production" } as const;

describe("layer", () => {
  it("sets kind on every layer", () => {
    expect(preset({ config: {}, name: "a" }).kind).toBe("preset");
    expect(contribute({ at: "x", because: "b", item: 1, name: "a" }).kind).toBe("contribution");
    expect(remove({ because: "b", name: "a", target: "t" }).kind).toBe("removal");
    expect(override({ because: "b", name: "a", refine: (c) => c }).kind).toBe("override");
  });

  it("keeps the options it was constructed with", () => {
    const held = contribute({
      at: "test.setupFiles",
      because: "a reason",
      item: "./a.ts",
      name: "s",
    });

    expect(held).toMatchObject({ at: "test.setupFiles", because: "a reason", item: "./a.ts" });
  });

  it("applies to every command when apply is absent", () => {
    expect(applies(preset({ config: {}, name: "a" }), BUILDING)).toBe(true);
  });

  it("applies only to the command it names", () => {
    expect(applies(preset({ apply: "build", config: {}, name: "a" }), BUILDING)).toBe(true);
    expect(applies(preset({ apply: "serve", config: {}, name: "a" }), BUILDING)).toBe(false);
  });

  it("calls apply when it is a function", () => {
    const held = preset({ apply: (env) => env.mode === "production", config: {}, name: "a" });

    expect(applies(held, BUILDING)).toBe(true);
    expect(applies(held, { command: "build", mode: "test" })).toBe(false);
  });

  it("renames a layer derived from another", () => {
    const held = named("react.rendered", contribute({ at: "x", because: "b", item: 1, name: "a" }));

    expect(held.name).toBe("react.rendered");
  });

  it("keeps every field but the name including the kind", () => {
    const held = named("b", contribute({ at: "x", because: "why", item: 1, name: "a" }));

    expect(held).toMatchObject({ at: "x", because: "why", item: 1, kind: "contribution" });
  });

  it("leaves the layer it was given unchanged", () => {
    const original = preset({ config: {}, name: "a" });

    named("b", original);

    expect(original.name).toBe("a");
  });

  it("prefixes each name with the owner", () => {
    const held = owned("mine", [
      preset({ config: {}, name: "a" }),
      preset({ config: {}, name: "b" }),
    ]);

    expect(held.map((one) => one.name)).toStrictEqual(["mine/a", "mine/b"]);
  });

  it("flattens a nested array of layers", () => {
    const held = owned("mine", [
      preset({ config: {}, name: "a" }),
      [preset({ config: {}, name: "b" }), [preset({ config: {}, name: "c" })]],
    ]);

    expect(held.map((one) => one.name)).toStrictEqual(["mine/a", "mine/b", "mine/c"]);
  });
});
