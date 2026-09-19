import { describe, expect, it } from "vitest";

import { describedBy, idsOf } from "#field/ids.ts";

describe("ids", () => {
  it("keeps the control's own identifier so a label outside the field reaches it", () => {
    expect(idsOf("email").control).toBe("email");
  });

  it("derives the other three from it", () => {
    expect(idsOf("email")).toStrictEqual({
      control: "email",
      errorText: "email-error",
      helperText: "email-helper",
      label: "email-label",
    });
  });

  it("describes a control by the helper text and then the message", () => {
    expect(describedBy(idsOf("email"))).toBe("email-helper email-error");
  });
});
