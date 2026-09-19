import { describe, expect, it } from "vitest";

import * as barrel from "#catalogue/index.ts";

describe("index", () => {
  it("names everything the catalogue publishes and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Catalogue",
      "FRAME",
      "NAMED",
      "Page",
      "Rail",
      "declarations",
      "declared",
      "entryOf",
      "grouped",
      "layouts",
      "parted",
      "routeId",
    ]);
  });
});
