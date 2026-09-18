import { describe, expect, it } from "vitest";

import { layers } from "#layers.ts";

describe("layers", () => {
  it("returns the plugin layer and the setup layer", () => {
    expect(layers()).toHaveLength(2);
  });

  it("names each layer for the call that built it", () => {
    expect(layers().map((one) => one.name)).toStrictEqual(["i18n.catalogued", "i18n.worded"]);
  });

  it("passes the options through to the plugin layer", () => {
    expect(() => layers({ eager: true })).not.toThrow();
  });
});
