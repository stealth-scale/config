import { describe, expect, it } from "vitest";

import { listed } from "#index.ts";

describe("lib-node", () => {
  it("answers nothing where there are no names", () => {
    expect(listed([])).toBe("");
  });

  it("answers the one name where there is one", () => {
    expect(listed(["Ada"])).toBe("Ada");
  });

  it("joins the last name with a word rather than a comma", () => {
    expect(listed(["Ada", "Grace", "Barbara"])).toBe("Ada, Grace and Barbara");
  });
});
