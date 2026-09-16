/**
 * Checks where each of the two servers listens, and what it answers to.
 */

import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { type Context, type Preset } from "@stealthscale/vite-config-core";

import { bound, port, reachable, type Serving } from "#serving/listening.ts";
import { answered } from "#vite.fixtures.ts";

/**
 * The two servers every layer here is expected to behave the same way for.
 */
const BOTH: readonly Serving[] = ["preview", "server"];

/**
 * Resolves a layer and reads back the block filed under one of the servers.
 *
 * @remarks
 *   Asking for the server a layer was not written for is how a check proves the
 *   other one was left alone, so an absent block is an answer rather than a
 *   failure.
 */
function block(
  layer: Preset,
  where: Serving,
  stated: Partial<Context> = {},
): Record<string, unknown> | undefined {
  const held = answered(layer, stated) as UserConfig;

  return (where === "server" ? held.server : held.preview) as Record<string, unknown> | undefined;
}

describe("listening", () => {
  it("writes under the server it was named and leaves the other alone", () => {
    for (const where of BOTH) {
      const other = where === "server" ? "preview" : "server";

      expect(block(port(where, 3000), where)?.["port"]).toBe(3000);
      expect(block(port(where, 3000), other)).toBeUndefined();
    }
  });

  it("pins the port", () => {
    for (const where of BOTH) {
      expect(block(port(where, 3000), where)?.["strictPort"]).toBe(true);
    }
  });

  it("accepts the names it was given", () => {
    for (const where of BOTH) {
      expect(block(reachable(where, ["a.example.test"]), where)?.["allowedHosts"]).toStrictEqual([
        "a.example.test",
      ]);
    }
  });

  it("takes the machine names instead when it has arranged its own", () => {
    for (const where of BOTH) {
      const held = block(reachable(where, ["stated.example.test"]), where, {
        env: { STEALTH_HOSTS: "machine.example.test" },
      });

      expect(held?.["allowedHosts"]).toStrictEqual(["machine.example.test"]);
    }
  });

  it("copies the list it was given", () => {
    const names = ["a.example.test"];

    expect(block(reachable("server", names), "server")?.["allowedHosts"]).not.toBe(names);
  });

  it("listens on the address it was given", () => {
    for (const where of BOTH) {
      expect(block(bound(where, "127.0.0.1"), where)?.["host"]).toBe("127.0.0.1");
    }
  });

  it("listens on every interface when asked to", () => {
    for (const where of BOTH) {
      expect(block(bound(where, true), where)?.["host"]).toBe(true);
    }
  });

  it("derives the address from the names a repository declared", () => {
    for (const where of BOTH) {
      expect(block(bound(where, ["a.example.test"]), where)?.["host"]).toBe("127.0.0.1");
    }
  });

  it("derives the address from the machine names too", () => {
    const held = block(bound("server", []), "server", {
      env: { STEALTH_HOSTS: "machine.example.test" },
    });

    expect(held?.["host"]).toBe("127.0.0.1");
  });

  it("contributes nothing when no name is given", () => {
    for (const where of BOTH) {
      expect(block(bound(where, []), where)).toBeUndefined();
    }
  });

  it("names the layer for the server it configures", () => {
    expect(bound("server", []).name).toBe("server.bound");
    expect(bound("preview", []).name).toBe("preview.bound");
    expect(reachable("preview", []).name).toBe("preview.reachable");
    expect(port("server", 3000).name).toBe("server.port(3000)");
  });

  it("includes the arguments in its name", () => {
    expect(bound("server", "127.0.0.1").name).toBe("server.bound(127.0.0.1)");
    expect(bound("server", true).name).toBe("server.bound(true)");
    expect(bound("server", ["a.example.test", "b.example.test"]).name).toBe(
      "server.bound(a.example.test, b.example.test)",
    );
    expect(reachable("preview", ["a.example.test"]).name).toBe("preview.reachable(a.example.test)");
  });
});
