import { describe, expect, it } from "vitest";

import { visuallyHidden } from "#patterns/visually-hidden.ts";

describe("visuallyHidden", () => {
  it("draws the element for a screen reader alone", () => {
    expect(visuallyHidden()).toStrictEqual({ srOnly: true });
  });
});
