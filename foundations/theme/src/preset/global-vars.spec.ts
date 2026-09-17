import { describe, expect, it } from "vitest";

import { globalVars } from "#preset/global-vars.ts";

describe("globalVars", () => {
  it("adds to the compiler's registrations rather than replacing them", () => {
    expect(Object.keys(globalVars)).toStrictEqual(["extend"]);
  });

  it("registers the angle a conic gradient is drawn from as an angle that starts at zero", () => {
    expect(globalVars.extend?.["--angle"]).toStrictEqual({
      inherits: false,
      initialValue: "0deg",
      syntax: "<angle>",
    });
  });
});
