import { describe, expect, it } from "vitest";

import { bound } from "#server/bound.ts";
import { answered } from "#vite.fixtures.ts";

describe("bound", () => {
  it("listens on the address it was given under the dev server key", async () => {
    expect((await answered(bound("127.0.0.1"))).server?.host).toBe("127.0.0.1");
  });

  it("leaves the preview alone", async () => {
    expect((await answered(bound("127.0.0.1"))).preview).toBeUndefined();
  });

  it("contributes nothing when no name is given", async () => {
    expect((await answered(bound())).server).toBeUndefined();
  });

  it("names the layer for the address it was written with", () => {
    expect(bound("127.0.0.1").name).toBe("server.bound(127.0.0.1)");
    expect(bound().name).toBe("server.bound");
  });
});
