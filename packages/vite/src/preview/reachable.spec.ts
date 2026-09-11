import { expect, test } from "vite-plus/test";

import { reachable } from "#preview/reachable.ts";
import { answered } from "#vite.fixtures.ts";

test("answers to the names it was given", async () => {
  const held = await answered(reachable(["app1.example.test"]));

  expect(held.preview?.allowedHosts).toEqual(["app1.example.test"]);
});

test("answers to more than one, a deployment having a name per application", async () => {
  const held = await answered(reachable(["a.example.test", "b.example.test"]));

  expect(held.preview?.allowedHosts).toHaveLength(2);
});

test("names them rather than turning the check off", async () => {
  expect((await answered(reachable(["a.example.test"]))).preview?.allowedHosts).not.toBe(true);
});

test("copies the list, so a caller's array is not the server's", async () => {
  const names = ["a.example.test"];

  expect((await answered(reachable(names))).preview?.allowedHosts).not.toBe(names);
});

test("takes the environment's answer instead, where a machine has arranged its own", async () => {
  const held = await answered(reachable(["stated.example.test"]), {
    env: { STEALTH_HOSTS: "override.example.test" },
  });

  expect(held.preview?.allowedHosts).toEqual(["override.example.test"]);
});

test("is named the same whatever a machine arranged, so a repository can take it back", () => {
  expect(reachable(["a.example.test"]).name).toBe("preview.reachable");
});
