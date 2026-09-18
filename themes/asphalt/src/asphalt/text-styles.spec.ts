import { describe, expect, it } from "vitest";

import { textStyles } from "#asphalt/text-styles.ts";
import { tokens } from "#asphalt/tokens.ts";

describe("textStyles", () => {
  it("names each size by the token the scale defines", () => {
    expect(Object.keys(textStyles)).toStrictEqual(Object.keys(tokens.fontSizes ?? {}));
  });

  it("reads the body size with its leading", () => {
    expect(textStyles["md"]).toHaveProperty("value.fontSize", "md");
  });
});
