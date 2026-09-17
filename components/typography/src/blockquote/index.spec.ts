import { describe, expect, it } from "vitest";

import * as barrel from "#blockquote/index.ts";

describe("index", () => {
  it("names every part under its short name and nothing beside them", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Caption", "Content", "Icon", "Root"]);
  });

  it("publishes neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
