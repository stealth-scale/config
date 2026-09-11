import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { bound } from "#server/bound.ts";

test("listens on the address it was given", () => {
  expect((bound("127.0.0.1").config as UserConfig).server?.host).toBe("127.0.0.1");
});

test("listens on every interface where that is what was asked for", () => {
  expect((bound(true).config as UserConfig).server?.host).toBe(true);
});

test("leaves the preview alone, which binds its own address", () => {
  expect((bound("127.0.0.1").config as UserConfig).preview).toBeUndefined();
});

test("names the address, so provenance says why a server is reachable", () => {
  expect(bound("127.0.0.1").name).toBe("server.bound(127.0.0.1)");
});

test("states nothing where the machine has arranged no name to be reached by", () => {
  delete process.env["STEALTH_HOSTS"];

  expect((bound().config as UserConfig).server).toBeUndefined();
});

test("says so in its name, so provenance shows the server kept its own answer", () => {
  delete process.env["STEALTH_HOSTS"];

  expect(bound().name).toBe("server.bound(its own answer)");
});

test("takes the address the machine arranged when it arranged one", () => {
  process.env["STEALTH_HOSTS"] = "a.example.test";

  expect((bound().config as UserConfig).server?.host).toBe("127.0.0.1");

  delete process.env["STEALTH_HOSTS"];
});
