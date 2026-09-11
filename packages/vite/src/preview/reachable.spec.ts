import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { reachable } from "#preview/reachable.ts";

test("answers to the names it was given", () => {
  const held = (reachable(["app1.example.test"]).config as UserConfig).preview?.allowedHosts;

  expect(held).toEqual(["app1.example.test"]);
});

test("answers to more than one, a deployment having a name per application", () => {
  const held = reachable(["a.example.test", "b.example.test"]);

  expect((held.config as UserConfig).preview?.allowedHosts).toHaveLength(2);
});

test("names them rather than turning the check off", () => {
  expect((reachable(["a.example.test"]).config as UserConfig).preview?.allowedHosts).not.toBe(true);
});

test("copies the list, so a caller's array is not the server's", () => {
  const names = ["a.example.test"];

  expect((reachable(names).config as UserConfig).preview?.allowedHosts).not.toBe(names);
});

test("names the hosts, so provenance says who was let in", () => {
  expect(reachable(["a.example.test"]).name).toBe("preview.reachable(a.example.test)");
});
