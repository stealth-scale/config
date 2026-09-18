import { describe, expect, it } from "vitest";

import { readProfile, resetProfiles, writeProfile } from "#records.ts";

describe("readProfile", () => {
  it("reads the profile saved under an identifier", () => {
    resetProfiles();

    expect(readProfile("p-1")).toStrictEqual({
      bio: "",
      email: "roy@example.com",
      id: "p-1",
      name: "Roy",
    });
  });

  it("answers nothing for an identifier nobody saved", () => {
    expect(readProfile("p-9")).toBeUndefined();
  });
});

describe("writeProfile", () => {
  it("saves a profile the next read answers", () => {
    writeProfile({ bio: "Hi", email: "ann@example.com", id: "p-2", name: "Ann" });

    expect(readProfile("p-2")?.name).toBe("Ann");
  });
});

describe("resetProfiles", () => {
  it("forgets what was saved and puts the first profile back", () => {
    writeProfile({ bio: "Hi", email: "roy@example.com", id: "p-1", name: "Roy K" });
    writeProfile({ bio: "", email: "ann@example.com", id: "p-3", name: "Ann" });
    resetProfiles();

    expect(readProfile("p-1")?.name).toBe("Roy");
    expect(readProfile("p-3")).toBeUndefined();
  });
});
