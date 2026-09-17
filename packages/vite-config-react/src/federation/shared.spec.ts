/**
 * Checks which packages are shared and the range they are shared at.
 */

import { describe, expect, it } from "vitest";

import { shared } from "#federation/shared.ts";

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
});
