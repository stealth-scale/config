import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("publishes nothing while the package holds no component", () => {
    expect(Object.keys(barrel)).toStrictEqual([]);
  });
});
