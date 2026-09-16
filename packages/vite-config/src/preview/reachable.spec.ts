/**
 * Proves a preview server names its hosts rather than admitting all of them.
 */

import { describe, expect, it } from "vitest";

import { reachable } from "#preview/reachable.ts";
import { answered } from "#vite.fixtures.ts";

describe("reachable", () => {
  it("accepts the names it was given under the preview key", async () => {
    const held = await answered(reachable(["app1.example.test"]));

    expect(held.preview?.allowedHosts).toStrictEqual(["app1.example.test"]);
  });

  it("accepts more than one name", async () => {
    const held = await answered(reachable(["a.example.test", "b.example.test"]));

    expect(held.preview?.allowedHosts).toHaveLength(2);
  });

  it("names the hosts rather than turning the check off", async () => {
    expect((await answered(reachable(["a.example.test"]))).preview?.allowedHosts).not.toBe(true);
  });

  it("changes nothing on the dev server", async () => {
    expect((await answered(reachable(["a.example.test"]))).server).toBeUndefined();
  });

  it("names the layer for the names it was written with", () => {
    expect(reachable(["a.example.test"]).name).toBe("preview.reachable(a.example.test)");
    expect(reachable(["a.example.test", "b.example.test"]).name).toBe(
      "preview.reachable(a.example.test, b.example.test)",
    );
  });
});
