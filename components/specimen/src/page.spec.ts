import { describe, expect, it } from "vitest";

import { scene, type Scene, specimen } from "#page.ts";

const SIZES: Scene = { draw: () => null, title: "Sizes" };

describe("page", () => {
  it("returns the page it was given", () => {
    const page = { group: "Actions", id: "actions/button", scenes: [SIZES] };

    expect(specimen(page)).toStrictEqual(page);
  });

  it("returns the scene it was given", () => {
    expect(scene(SIZES)).toStrictEqual(SIZES);
  });

  it("keeps the scenes in the order the page lists them", () => {
    const states: Scene = { draw: () => null, title: "States" };
    const page = specimen({ id: "actions/button", scenes: [states, SIZES] });

    expect(page.scenes.map((held) => held.title)).toStrictEqual(["States", "Sizes"]);
  });
});
