import { expect, test } from "vite-plus/test";

import { bundled } from "#ssr/bundled.ts";

test("appends to the list rather than replacing what the builder worked out", () => {
  for (const held of bundled({ because: "why", deps: ["@acme/ui"] })) {
    expect(held.at).toBe("ssr.noExternal");
  }
});

test("makes one contribution per package, so one can be taken back without the rest", () => {
  const held = bundled({ because: "why", deps: ["one", "two"] });

  expect(held.map((each) => each.name)).toEqual(["ssr.bundled(one)", "ssr.bundled(two)"]);
});

test("carries the package by name, which is how a server build names what it leaves out", () => {
  const [held] = bundled({ because: "why", deps: ["@acme/ui"] });

  expect(held?.item).toBe("@acme/ui");
});

test("keeps why node cannot load it, which is what a later reader has to weigh", () => {
  const [held] = bundled({ because: "it imports a stylesheet", deps: ["@acme/ui"] });

  expect(held?.because).toBe("it imports a stylesheet");
});

test("contributes nothing when given nothing", () => {
  expect(bundled({ because: "why", deps: [] })).toEqual([]);
});
