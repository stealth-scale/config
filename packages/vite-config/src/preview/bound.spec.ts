/**
 * Proves a preview server binds where it was told and leaves the development
 * server alone.
 */

import { describe, expect, it } from "vitest";

import { bound } from "#preview/bound.ts";
import { answered } from "#vite.fixtures.ts";

describe("bound", () => {
  it("listens on the address it was given under the preview key", async () => {
    expect((await answered(bound("127.0.0.1"))).preview?.host).toBe("127.0.0.1");
  });

  it("changes nothing on the dev server", async () => {
    expect((await answered(bound("127.0.0.1"))).server).toBeUndefined();
  });

  it("contributes nothing when no name is given", async () => {
    expect((await answered(bound())).preview).toBeUndefined();
  });

  it("names the layer for the address it was written with", () => {
    expect(bound("127.0.0.1").name).toBe("preview.bound(127.0.0.1)");
    expect(bound().name).toBe("preview.bound");
  });
});
