import { expect, test } from "vite-plus/test";

import { resolved, surviving } from "#core/compose.ts";
import { contribute, type Contribution, preset, type Removal, remove } from "#core/layer.ts";

/**
 * States one contribution, since only its name matters here.
 *
 * @param name - What to call it.
 * @returns The contribution.
 */
function added(name: string): Contribution {
  return contribute({ at: "test.setupFiles", because: "a reason", item: name, name });
}

/**
 * Takes one back.
 *
 * @param target - The contribution to take back.
 * @returns The removal.
 */
function taken(target: string): Removal {
  return remove({ because: "a reason", name: `without(${target})`, target });
}

test("keeps every contribution nothing took back", () => {
  const held = surviving([added("a"), added("b")]);

  expect(held.map((one) => one.name)).toEqual(["a", "b"]);
});

test("keeps a preset, so that a removal can reach one", () => {
  const held = surviving([preset({ config: {}, name: "base" }), added("a")]);

  expect(held.map((one) => one.name)).toEqual(["base", "a"]);
});

test("takes back a preset by name, which is the alternative to restating what it set", () => {
  const held = surviving([preset({ config: {}, name: "base" }), added("a"), taken("base")]);

  expect(held.map((one) => one.name)).toEqual(["a"]);
});

test("takes back the one a removal names", () => {
  const held = surviving([added("a"), added("b"), taken("a")]);

  expect(held.map((one) => one.name)).toEqual(["b"]);
});

test("takes back the nearest above it, leaving a later one standing", () => {
  const held = surviving([added("a"), taken("a"), added("a")]);

  expect(held.map((one) => one.name)).toEqual(["a"]);
});

test("refuses a removal naming nothing contributed above it", () => {
  expect(() => surviving([taken("a"), added("a")])).toThrow(/written too early/u);
});

test("refuses a removal naming nothing at all", () => {
  expect(() => surviving([added("a"), taken("z")])).toThrow(/nothing above it stated/u);
});

test("settles a preset asking to go last after one that said nothing", async () => {
  const held = await resolved(
    [
      preset({ config: { mode: "last" }, enforce: "post", name: "after" }),
      preset({ config: { mode: "first" }, name: "before" }),
    ],
    { command: "build", mode: "production" },
  );

  expect(held.config.mode).toBe("last");
});
