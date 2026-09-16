import { describe, expect, it } from "vitest";

import { field } from "#authoring/recipes/field.ts";

describe("field", () => {
  it("draws the panel surface with a border and the page ink", () => {
    expect(field()).toMatchObject({
      background: "bg.panel",
      borderColor: "border",
      borderWidth: "sm",
      color: "fg",
    });
  });

  it("draws the placeholder in the muted ink", () => {
    expect(field()).toMatchObject({ _placeholder: { color: "fg.muted" } });
  });

  it("draws an invalid field in the error palette", () => {
    expect(field()).toMatchObject({
      _invalid: { borderColor: "border.error", focusRingColor: "error.focusRing" },
    });
  });

  it("draws the focus ring inside the box", () => {
    expect(field()).toMatchObject({
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "inside",
    });
  });

  it("reads the disabled look and the subtle surface for a read-only field", () => {
    expect(field()).toMatchObject({
      _disabled: { layerStyle: "disabled" },
      _readOnly: { background: "bg.subtle" },
    });
  });
});
