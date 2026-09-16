import { describe, expect, it } from "vitest";

import * as published from "#index.ts";

/**
 * The runtime surface a specification imports.
 */
const SURFACE = ["isLayer", "layersOf", "prefixOf", "publishedOf", "violations", "walked"];

describe("index", () => {
  it("publishes the suite and the readers a specification builds on", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(SURFACE);
  });
});
