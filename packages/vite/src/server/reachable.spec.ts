import { expect, test } from "vite-plus/test";

import { reachable } from "#server/reachable.ts";
import { answered } from "#serving/serving.fixtures.ts";

test("answers to the names it was given", async () => {
  const held = await answered(reachable(["app1.example.test"]));

  expect(held.server?.allowedHosts).toEqual(["app1.example.test"]);
});

test("leaves the preview alone, which keeps its own list", async () => {
  expect((await answered(reachable(["a.example.test"]))).preview).toBeUndefined();
});

test("copies the list, so a caller's array is not the server's", async () => {
  const names = ["a.example.test"];

  expect((await answered(reachable(names))).server?.allowedHosts).not.toBe(names);
});

test("takes the environment's answer instead, where a machine has arranged its own", async () => {
  const held = await answered(reachable(["stated.example.test"]), {
    STEALTH_HOSTS: "override.example.test",
  });

  expect(held.server?.allowedHosts).toEqual(["override.example.test"]);
});

test("is named the same whatever a machine arranged, so a repository can take it back", () => {
  expect(reachable(["a.example.test"]).name).toBe("server.reachable");
});
