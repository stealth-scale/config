import { describe, expect, it } from "vitest";

import { ANONYMOUS, holds, type Session } from "#session.ts";

/**
 * Somebody who has signed in and may read the audit.
 */
const AUDITOR: Session = { permissions: ["audit"], signedIn: true };

describe("holds", () => {
  it("refuses a signed-in condition for nobody", () => {
    expect(holds(ANONYMOUS, { kind: "signedIn" })).toBe(false);
  });

  it("accepts a signed-in condition for somebody who has", () => {
    expect(holds(AUDITOR, { kind: "signedIn" })).toBe(true);
  });

  it("accepts a permission the session carries", () => {
    expect(holds(AUDITOR, { kind: "permission", permission: "audit" })).toBe(true);
  });

  it("refuses a permission the session does not carry", () => {
    expect(holds(AUDITOR, { kind: "permission", permission: "publish" })).toBe(false);
  });
});
