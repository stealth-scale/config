import { describe, expect, it } from "vitest";

import { checkoutOptions } from "#options.ts";

describe("checkoutOptions", () => {
  it("starts from the schema's defaults with one empty line", () => {
    expect(checkoutOptions.defaultValues).toMatchObject({
      billing: { city: "", country: "", line1: "", postcode: "" },
      kind: "",
      lines: [{ amount: 0, description: "" }],
      name: "",
    });
    expect(checkoutOptions.validators.onDynamic["~standard"].vendor).toBe("stealthscale");
  });
});
