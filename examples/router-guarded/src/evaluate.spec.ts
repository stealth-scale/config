import { describe, expect, it } from "vitest";

import { isRedirect } from "@stealthscale/provider-router";

import { evaluator } from "#evaluate.ts";
import { ANONYMOUS, type Session } from "#session.ts";

/**
 * Somebody who has signed in and may read the audit.
 */
const AUDITOR: Session = { permissions: ["audit"], signedIn: true };

describe("evaluator", () => {
  it("returns true where the condition holds", () => {
    expect(evaluator(AUDITOR)({ kind: "permission", permission: "audit" })).toBe(true);
  });

  it("returns false where the condition fails", () => {
    expect(evaluator(AUDITOR)({ kind: "permission", permission: "publish" })).toBe(false);
  });

  it("throws a redirect for somebody who has not signed in", () => {
    let thrown: unknown;

    try {
      evaluator(ANONYMOUS)({ kind: "signedIn" });
    } catch (error: unknown) {
      thrown = error;
    }

    expect(isRedirect(thrown)).toBe(true);
  });
});
