import { expect, test } from "vite-plus/test";

import { bound } from "#server/bound.ts";
import { answered } from "#vite.fixtures.ts";

test("listens on the address it was given, under the dev server's own key", async () => {
  expect((await answered(bound("127.0.0.1"))).server?.host).toBe("127.0.0.1");
});

test("leaves the preview alone, which binds its own address", async () => {
  expect((await answered(bound("127.0.0.1"))).preview).toBeUndefined();
});

test("states nothing where no name is in play, the default bind being right on its own", async () => {
  expect((await answered(bound())).server).toBeUndefined();
});

test("is named the same whatever a machine arranged, so a repository can take it back", () => {
  expect(bound("127.0.0.1").name).toBe("server.bound");
});
