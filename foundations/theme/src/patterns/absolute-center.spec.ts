import { describe, expect, it } from "vitest";

import { absoluteCenter } from "#patterns/absolute-center.ts";

describe("absoluteCenter", () => {
  it("centres on both axes when nothing is stated", () => {
    expect(absoluteCenter()).toMatchObject({
      insetInlineStart: "50%",
      position: "absolute",
      top: "50%",
      translate: "-50% -50%",
    });
  });

  it("turns the inline translation around under right-to-left writing", () => {
    expect(absoluteCenter()).toMatchObject({ _rtl: { translate: "50% -50%" } });
    expect(absoluteCenter({ axis: "horizontal" })).toMatchObject({ _rtl: { translate: "50%" } });
  });

  it("centres on one axis when asked", () => {
    expect(absoluteCenter({ axis: "vertical" })).toMatchObject({ top: "50%", translate: "0 -50%" });
    expect(absoluteCenter({ axis: "vertical" })).not.toHaveProperty("insetInlineStart");
  });
});
