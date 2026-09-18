import { describe, expect, it } from "vitest";

import { worded } from "#worded.ts";

describe("worded", () => {
  it("appends to the runner's setup files", () => {
    expect(worded().at).toBe("test.setupFiles");
  });

  it("names the layer for the call a consumer wrote", () => {
    expect(worded().name).toBe("i18n.worded");
  });

  it("resolves the foundation's setup file to an absolute path", () => {
    expect(String(worded().item).startsWith("/")).toBe(true);
  });

  it("points at the foundation's testing entry", () => {
    expect(String(worded().item).endsWith("testing.ts")).toBe(true);
  });

  it("states why the setup file is there", () => {
    expect(worded().because).toContain("specification");
  });
});
