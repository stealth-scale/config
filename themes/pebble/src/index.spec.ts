import { describe, expect, it } from "vitest";

import * as published from "#index.ts";

describe("index", () => {
  it("publishes every theme the package states", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(["pebble"]);
  });
});
