import { describe, expect, it } from "vitest";

import { audit, catalogue, mine, summary } from "#catalogue.ts";

describe("catalogue", () => {
  it("returns one declaration per page", () => {
    expect(catalogue().map((one) => one.id)).toStrictEqual([summary.id, mine.id, audit.id]);
  });

  it("asks nothing of the page anybody may read", () => {
    expect(catalogue()[0]?.when).toBeUndefined();
  });

  it("asks for a signed-in reader on the page that needs one", () => {
    expect(catalogue()[1]?.when).toStrictEqual({ kind: "signedIn" });
  });

  it("asks for a permission on the page that needs one", () => {
    expect(catalogue()[2]?.when).toStrictEqual({ kind: "permission", permission: "audit" });
  });
});
