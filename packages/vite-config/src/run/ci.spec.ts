/**
 * Proves the proving task runs its three commands in order and caches none of
 * it.
 */

import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { ci } from "#run/ci.ts";

/**
 * Reads the proving task out of a freshly built layer.
 */
function proving(): { cache: false; command: string[] } {
  return (ci().config as UserConfig).run?.tasks?.["ci"] as { cache: false; command: string[] };
}

describe("ci", () => {
  it("builds before it checks", () => {
    const held = proving().command;

    expect(held.indexOf("vp run -r build")).toBeLessThan(held.indexOf("vp check"));
  });

  it("checks before it tests", () => {
    const held = proving().command;

    expect(held.indexOf("vp check")).toBeLessThan(held.indexOf("vp test --run"));
  });

  it("runs the tests once rather than watching", () => {
    expect(proving().command).toContain("vp test --run");
  });

  it("is never cached", () => {
    expect(proving().cache).toBe(false);
  });

  it("installs nothing", () => {
    expect(proving().command.join(" ")).not.toMatch(/install|audit/u);
  });

  it("names the layer so a repository can remove it", () => {
    expect(ci().name).toBe("run.ci");
  });
});
