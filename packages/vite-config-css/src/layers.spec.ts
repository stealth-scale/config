import { describe, expect, it } from "vitest";

import { layers } from "#layers.ts";

describe("layers", () => {
  it("composes to the check named for the call a consumer wrote", () => {
    expect(layers().map((one) => one.name)).toStrictEqual(["css.check"]);
  });

  it("passes the repository's own options through to the check", () => {
    expect(() => layers({ also: ["**/*.module.css"] })).not.toThrow();
    expect(layers({ except: ["vendor/**"] })).toHaveLength(1);
  });
});
