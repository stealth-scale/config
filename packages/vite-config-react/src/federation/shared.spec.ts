import { describe, expect, it } from "vitest";

import { installed, shared } from "#federation/shared.ts";

describe("shared", () => {
  it("shares React as a singleton", () => {
    expect(shared()["react"]?.singleton).toBe(true);
  });

  it("shares the renderer as a singleton", () => {
    expect(shared()["react-dom"]?.singleton).toBe(true);
  });

  it("shares nothing else", () => {
    expect(Object.keys(shared()).toSorted()).toStrictEqual(["react", "react-dom"]);
  });

  it("counts a whole major as the same React", () => {
    expect(shared("19.3.0")["react"]?.requiredVersion).toBe("^19.0.0");
  });

  it("follows the installed version rather than one written here", () => {
    expect(shared("20.1.4")["react"]?.requiredVersion).toBe("^20.0.0");
  });

  it("applies the same range to both packages", () => {
    const held = shared("19.3.0");

    expect(held["react"]?.requiredVersion).toBe(held["react-dom"]?.requiredVersion);
  });

  it("reads the tree when nothing is passed", () => {
    expect(shared()["react"]?.requiredVersion).toMatch(/^\^\d+\.0\.0$/u);
  });

  it("reads React's version from the manifest it was pointed at", () => {
    expect(installed(() => ({ version: "19.3.0" }))).toBe("19.3.0");
  });

  it("throws for a manifest declaring no version", () => {
    expect(() => installed(() => ({}))).toThrow(/could not read React's version/u);
  });

  it("throws when the manifest cannot be resolved", () => {
    expect(() => installed(() => "not a manifest")).toThrow(/could not read React's version/u);
  });
});
