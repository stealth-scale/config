import { describe, expect, it } from "vitest";

import { textStyles } from "#text-styles.ts";
import { tokens } from "#tokens.ts";

describe("textStyles", () => {
  it("names each size by the token the scale defines", () => {
    expect(Object.keys(textStyles)).toStrictEqual(Object.keys(tokens.fontSizes ?? {}));
  });

  it("reads the body size with its leading and tracking", () => {
    expect(textStyles["md"]).toStrictEqual({
      value: { fontSize: "md", letterSpacing: "0em", lineHeight: "1.5" },
    });
  });
});
