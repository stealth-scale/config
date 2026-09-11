import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { reachable } from "#server/reachable.ts";

test("answers to the names it was given", () => {
  const held = (reachable(["app1.example.test"]).config as UserConfig).server?.allowedHosts;

  expect(held).toEqual(["app1.example.test"]);
});

test("leaves the preview alone, which keeps its own list", () => {
  expect((reachable(["a.example.test"]).config as UserConfig).preview).toBeUndefined();
});

test("copies the list, so a caller's array is not the server's", () => {
  const names = ["a.example.test"];

  expect((reachable(names).config as UserConfig).server?.allowedHosts).not.toBe(names);
});

test("names the hosts, so provenance says who was let in", () => {
  expect(reachable(["a.example.test"]).name).toBe("server.reachable(a.example.test)");
});
