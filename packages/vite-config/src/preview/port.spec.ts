/**
 * Proves a fixed preview port reaches the preview alone.
 */

import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { port } from "#preview/port.ts";

describe("port", () => {
  it("serves the build at the port it was given", () => {
    expect((port(4300).config as UserConfig).preview?.port).toBe(4300);
  });

  it("fails rather than moving to another port", () => {
    expect((port(4300).config as UserConfig).preview?.strictPort).toBe(true);
  });

  it("changes nothing on the dev server", () => {
    expect((port(4300).config as UserConfig).server).toBeUndefined();
  });

  it("names the port", () => {
    expect(port(4300).name).toBe("preview.port(4300)");
  });
});
