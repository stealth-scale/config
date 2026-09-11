import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { type Context, type Preset } from "@stealthscale/vite-config-core";

import { bound, port, reachable, type Serving } from "#serving/listening.ts";
import { answered } from "#vite.fixtures.ts";

/**
 * Both servers, since everything here is true of each.
 */
const BOTH: readonly Serving[] = ["preview", "server"];

/**
 * Reads back the block a layer wrote, under whichever of the two keys it wrote it.
 *
 * Read without awaiting, because every layer here states its config outright.
 *
 * @param layer - The layer to read.
 * @param where - Which server it was speaking about.
 * @param stated - Whatever differs from an ordinary package being served.
 * @returns That server's block, or nothing where the layer stated none.
 */
function block(
  layer: Preset,
  where: Serving,
  stated: Partial<Context> = {},
): Record<string, unknown> | undefined {
  const held = answered(layer, stated) as UserConfig;

  return (where === "server" ? held.server : held.preview) as Record<string, unknown> | undefined;
}

test("writes under the server it was named, and leaves the other alone", () => {
  for (const where of BOTH) {
    const other = where === "server" ? "preview" : "server";

    expect(block(port(where, 3000), where)?.["port"]).toBe(3000);
    expect(block(port(where, 3000), other)).toBeUndefined();
  }
});

test("pins the port, so a busy one fails rather than quietly becoming another", () => {
  for (const where of BOTH) {
    expect(block(port(where, 3000), where)?.["strictPort"]).toBe(true);
  }
});

test("answers to the names it was given", () => {
  for (const where of BOTH) {
    expect(block(reachable(where, ["a.example.test"]), where)?.["allowedHosts"]).toEqual([
      "a.example.test",
    ]);
  }
});

test("takes the machine's names instead, where it has arranged its own", () => {
  for (const where of BOTH) {
    const held = block(reachable(where, ["stated.example.test"]), where, {
      env: { STEALTH_HOSTS: "machine.example.test" },
    });

    expect(held?.["allowedHosts"]).toEqual(["machine.example.test"]);
  }
});

test("copies the list, so a caller's array is not the server's", () => {
  const names = ["a.example.test"];

  expect(block(reachable("server", names), "server")?.["allowedHosts"]).not.toBe(names);
});

test("listens on the address it was given", () => {
  for (const where of BOTH) {
    expect(block(bound(where, "127.0.0.1"), where)?.["host"]).toBe("127.0.0.1");
  }
});

test("listens on every interface where that is what was asked for", () => {
  for (const where of BOTH) {
    expect(block(bound(where, true), where)?.["host"]).toBe(true);
  }
});

test("works the address out from the names a repository stated", () => {
  for (const where of BOTH) {
    expect(block(bound(where, ["a.example.test"]), where)?.["host"]).toBe("127.0.0.1");
  }
});

test("works it out from the machine's names too", () => {
  const held = block(bound("server", []), "server", {
    env: { STEALTH_HOSTS: "machine.example.test" },
  });

  expect(held?.["host"]).toBe("127.0.0.1");
});

test("states nothing where no name is in play, the default bind being right on its own", () => {
  for (const where of BOTH) {
    expect(block(bound(where, []), where)).toBeUndefined();
  }
});

test("names itself for the server it configures, so a repository can take one back", () => {
  expect(bound("server", []).name).toBe("server.bound");
  expect(bound("preview", []).name).toBe("preview.bound");
  expect(reachable("preview", []).name).toBe("preview.reachable");
  expect(port("server", 3000).name).toBe("server.port(3000)");
});
