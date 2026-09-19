import { describe, expect, it } from "vitest";

import { stated } from "#stated.ts";

describe("stated", () => {
  it("keeps every setting a caller stated", () => {
    expect(stated({ loopFocus: true, selectionMode: "single" })).toStrictEqual({
      loopFocus: true,
      selectionMode: "single",
    });
  });

  it("drops a setting passed as undefined", () => {
    expect(stated({ loopFocus: undefined, selectionMode: "single" })).toStrictEqual({
      selectionMode: "single",
    });
  });

  it("keeps a setting stated as false", () => {
    expect(stated({ loopFocus: false })).toStrictEqual({ loopFocus: false });
  });

  it("returns an empty object where nothing was stated", () => {
    expect(stated({ loopFocus: undefined })).toStrictEqual({});
  });
});
