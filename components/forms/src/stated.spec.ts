import { describe, expect, it } from "vitest";

import { stated } from "#stated.ts";

describe("stated", () => {
  it("keeps every setting a caller stated", () => {
    expect(stated({ checked: true, name: "terms" })).toStrictEqual({
      checked: true,
      name: "terms",
    });
  });

  it("drops a setting passed as undefined", () => {
    expect(stated({ checked: undefined, name: "terms" })).toStrictEqual({ name: "terms" });
  });

  it("keeps a setting stated as false", () => {
    expect(stated({ checked: false })).toStrictEqual({ checked: false });
  });

  it("keeps a setting stated as null", () => {
    expect(stated({ form: null })).toStrictEqual({ form: null });
  });

  it("returns an empty object where nothing was stated", () => {
    expect(stated({ checked: undefined, name: undefined })).toStrictEqual({});
  });
});
