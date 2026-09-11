import { expect, test } from "vite-plus/test";

import { bound } from "#server/bound.ts";
import { answered } from "#serving/serving.fixtures.ts";

test("listens on the address it was given", async () => {
  expect((await answered(bound("127.0.0.1"))).server?.host).toBe("127.0.0.1");
});

test("listens on every interface where that is what was asked for", async () => {
  expect((await answered(bound(true))).server?.host).toBe(true);
});

test("leaves the preview alone, which binds its own address", async () => {
  expect((await answered(bound("127.0.0.1"))).preview).toBeUndefined();
});

test("states nothing where no name is in play, the default bind being right on its own", async () => {
  expect((await answered(bound())).server).toBeUndefined();
});

test("takes the address the machine arranged when it arranged one", async () => {
  const held = await answered(bound(), { STEALTH_HOSTS: "a.example.test" });

  expect(held.server?.host).toBe("127.0.0.1");
});

test("works it out from the names the repository stated, which resolve there too", async () => {
  expect((await answered(bound(["a.example.test"]))).server?.host).toBe("127.0.0.1");
});

test("is named the same whatever a machine arranged, so a repository can take it back", () => {
  expect(bound("127.0.0.1").name).toBe("server.bound");
});
