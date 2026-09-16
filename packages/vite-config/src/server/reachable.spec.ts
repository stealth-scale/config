import { describe, expect, it } from "vitest";

import { reachable } from "#server/reachable.ts";
import { answered } from "#vite.fixtures.ts";

describe("reachable", () => {
  it("accepts the names it was given under the dev server key", async () => {
    const held = await answered(reachable(["app1.example.test"]));

    expect(held.server?.allowedHosts).toStrictEqual(["app1.example.test"]);
  });

  it("leaves the preview alone", async () => {
    expect((await answered(reachable(["a.example.test"]))).preview).toBeUndefined();
  });

  it("names the layer for the names it was written with", () => {
    expect(reachable(["a.example.test"]).name).toBe("server.reachable(a.example.test)");
    expect(reachable().name).toBe("server.reachable");
  });
});
