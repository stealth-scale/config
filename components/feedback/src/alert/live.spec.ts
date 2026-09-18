import { describe, expect, it } from "vitest";

import { LIVES, ROLES } from "#alert/live.ts";

describe("live", () => {
  it("lists the three loudnesses from the quietest", () => {
    expect(LIVES).toStrictEqual(["off", "polite", "assertive"]);
  });

  it("announces an assertive alert through the alert role", () => {
    expect(ROLES.assertive).toStrictEqual({ role: "alert" });
  });

  it("announces a polite alert through the status role", () => {
    expect(ROLES.polite).toStrictEqual({ role: "status" });
  });

  it("gives a quiet alert no role", () => {
    expect(ROLES.off).toStrictEqual({});
  });

  it("states no aria-live beside a role that already implies one", () => {
    expect.hasAssertions();

    for (const attributes of Object.values(ROLES)) {
      expect(attributes).not.toHaveProperty("aria-live");
    }
  });
});
