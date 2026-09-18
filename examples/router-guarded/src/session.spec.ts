import { describe, expect, it } from "vitest";

import { ANONYMOUS, holds, session, type Session, signedInAs, watchSession } from "#session.ts";

/**
 * Somebody who has signed in and may read the audit.
 */
const AUDITOR: Session = { permissions: ["audit"], signedIn: true };

describe("session", () => {
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

  it("returns whoever was recorded last", () => {
    signedInAs(AUDITOR);

    expect(session()).toStrictEqual(AUDITOR);
  });

  it("tells a watcher that the session changed", () => {
    let told = 0;
    const withdraw = watchSession(() => {
      told += 1;
    });

    signedInAs(ANONYMOUS);
    withdraw();

    expect(told).toBe(1);
  });

  it("tells a withdrawn watcher nothing", () => {
    let told = 0;
    const withdraw = watchSession(() => {
      told += 1;
    });

    withdraw();
    signedInAs(AUDITOR);
    signedInAs(ANONYMOUS);

    expect(told).toBe(0);
  });
});
