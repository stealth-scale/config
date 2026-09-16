/**
 * Covers which layers survive a removal and what each pass contributes.
 */

import { describe, expect, it } from "vitest";

import { resolved, surviving } from "#compose.ts";
import { BUILDING } from "#core.fixtures.ts";
import { contribute, type Contribution, preset, type Removal, remove } from "#layer.ts";

/**
 * Builds a contribution whose name is also the item it appends.
 *
 * @remarks
 *   The two are the same string so an assertion can read the surviving names
 *   and the appended items interchangeably.
 */
function added(name: string): Contribution {
  return contribute({ at: "test.setupFiles", because: "a reason", item: name, name });
}

/**
 * Builds a removal aimed at one name, called after the name it takes back.
 */
function taken(target: string): Removal {
  return remove({ because: "a reason", name: `without(${target})`, target });
}

describe("compose", () => {
  it("keeps every contribution no removal took back", () => {
    const held = surviving([added("a"), added("b")]);

    expect(held.map((one) => one.name)).toStrictEqual(["a", "b"]);
  });

  it("keeps a preset", () => {
    const held = surviving([preset({ config: {}, name: "base" }), added("a")]);

    expect(held.map((one) => one.name)).toStrictEqual(["base", "a"]);
  });

  it("removes a preset by name", () => {
    const held = surviving([preset({ config: {}, name: "base" }), added("a"), taken("base")]);

    expect(held.map((one) => one.name)).toStrictEqual(["a"]);
  });

  it("removes the contribution a removal names", () => {
    const held = surviving([added("a"), added("b"), taken("a")]);

    expect(held.map((one) => one.name)).toStrictEqual(["b"]);
  });

  it("removes the nearest contribution above it", () => {
    const held = surviving([added("a"), taken("a"), added("a")]);

    expect(held.map((one) => one.name)).toStrictEqual(["a"]);
  });

  it("throws for a removal naming nothing contributed above it", () => {
    expect(() => surviving([taken("a"), added("a")])).toThrow(/written too early/u);
  });

  it("throws for a removal naming nothing", () => {
    expect(() => surviving([added("a"), taken("z")])).toThrow(/nothing above it stated/u);
  });

  it("orders a preset asking to go last after one that declared no order", async () => {
    const held = await resolved(BUILDING, [
      preset({ config: { mode: "last" }, enforce: "post", name: "after" }),
      preset({ config: { mode: "first" }, name: "before" }),
    ]);

    expect(held.mode).toBe("last");
  });

  it("appends what a contribution declares outright", async () => {
    const held = await resolved(BUILDING, [
      contribute({ at: "test.setupFiles", because: "a reason", item: "stated.ts", name: "one" }),
    ]);

    expect(held.test?.setupFiles).toStrictEqual(["stated.ts"]);
  });

  it("appends what a contribution derives from the config", async () => {
    const held = await resolved(BUILDING, [
      contribute({
        at: "test.setupFiles",
        because: "a reason",
        itemOf: (context) => `${context.mode}.ts`,
        name: "one",
      }),
    ]);

    expect(held.test?.setupFiles).toStrictEqual(["production.ts"]);
  });

  it("prefers the derived value when a layer declares both", async () => {
    const held = await resolved(BUILDING, [
      contribute({
        at: "test.setupFiles",
        because: "a reason",
        item: "stated.ts",
        itemOf: () => "worked-out.ts",
        name: "one",
      }),
    ]);

    expect(held.test?.setupFiles).toStrictEqual(["worked-out.ts"]);
  });
});
