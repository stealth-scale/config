import { describe, expect, it } from "vitest";

import { textStyles } from "#preset/styles/text-styles.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("textStyles", () => {
  it("draws every size of the type scale", () => {
    expect(tokenAt(textStyles, "md")).toStrictEqual({
      fontSize: "1.0000rem",
      letterSpacing: "0em",
      lineHeight: "1.5",
    });
  });

  it("names the roles over the sizes", () => {
    expect(Object.keys(textStyles).filter((name) => !/^\d?x?[a-z]{2}$/u.test(name))).toStrictEqual([
      "body",
      "caption",
      "code",
      "display",
      "heading",
      "label",
    ]);
  });

  it("sets a heading in the heading face at a tight leading", () => {
    expect(tokenAt(textStyles, "heading.md")).toStrictEqual({
      fontFamily: "heading",
      fontSize: "xl",
      fontWeight: "semibold",
      letterSpacing: "tight",
      lineHeight: "tight",
    });
  });

  it("sets a display role bold with no leading and the tightest tracking", () => {
    expect(tokenAt(textStyles, "display.lg")).toMatchObject({
      fontSize: "7xl",
      fontWeight: "bold",
      letterSpacing: "tighter",
      lineHeight: "none",
    });
  });

  it("offers a label for every control size", () => {
    expect(Object.keys(tokenAt(textStyles, "label") ?? {}).toSorted()).toStrictEqual([
      "lg",
      "md",
      "sm",
      "xl",
      "xs",
    ]);
    expect(tokenAt(textStyles, "label.md")).toMatchObject({ fontWeight: "medium" });
  });

  it("sets code in the monospaced face", () => {
    expect(tokenAt(textStyles, "code.sm")).toMatchObject({ fontFamily: "mono", fontSize: "sm" });
  });

  it("sets body text in the body face at normal leading", () => {
    expect(tokenAt(textStyles, "body.md")).toStrictEqual({
      fontSize: "md",
      fontWeight: "normal",
      letterSpacing: "normal",
      lineHeight: "normal",
    });
  });
});
