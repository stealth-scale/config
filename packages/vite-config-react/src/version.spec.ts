/**
 * Checks what is read off React's own manifest and how a bad one fails.
 */

import { describe, expect, it } from "vitest";

import { installed, major } from "#version.ts";

describe("installed", () => {
  it("reads React's version from the manifest it was pointed at", () => {
    expect(installed(() => ({ version: "19.3.0" }))).toBe("19.3.0");
  });

  it("reads the tree when nothing is passed", () => {
    expect(installed()).toMatch(/^\d+\./u);
  });

  it("throws for a manifest declaring no version", () => {
    expect(() => installed(() => ({}))).toThrow(/could not be read/u);
  });

  it("throws when the manifest cannot be resolved", () => {
    expect(() => installed(() => "not a manifest")).toThrow(/could not be read/u);
  });
});

describe("major", () => {
  it("keeps the leading number of a version", () => {
    expect(major("19.3.0")).toBe("19");
  });

  it("keeps a major of more than one digit whole", () => {
    expect(major("120.0.0")).toBe("120");
  });

  it("reads the installed React when nothing is passed", () => {
    expect(major()).toMatch(/^\d+$/u);
  });
});
