import { afterEach, expect, test } from "vite-plus/test";

import { bound, hosts, origins } from "#serving/environment.ts";

/**
 * What the environment held before a test changed it.
 */
const before = { ...process.env };

afterEach(() => {
  for (const named of ["STEALTH_HOSTS", "STEALTH_ORIGINS"]) {
    if (before[named] === undefined) delete process.env[named];
    else process.env[named] = before[named];
  }
});

test("reads the names the machine says its servers answer to", () => {
  process.env["STEALTH_HOSTS"] = "app1.example.test,app2.example.test";

  expect(hosts()).toEqual(["app1.example.test", "app2.example.test"]);
});

test("reads the origins allowed to fetch from it, which is a different list", () => {
  process.env["STEALTH_ORIGINS"] = "https://host.example.test";

  expect(origins()).toEqual(["https://host.example.test"]);
});

test("answers none where the machine has arranged none", () => {
  delete process.env["STEALTH_HOSTS"];

  expect(hosts()).toEqual([]);
});

test("drops the empties, so a trailing comma names nothing", () => {
  process.env["STEALTH_HOSTS"] = "a.example.test,,";

  expect(hosts()).toEqual(["a.example.test"]);
});

test("binds IPv4 loopback once names are in play, which is what they resolve to", () => {
  process.env["STEALTH_HOSTS"] = "a.example.test";

  expect(bound()).toBe("127.0.0.1");
});

test("leaves the server on its own answer where no name is in play", () => {
  delete process.env["STEALTH_HOSTS"];

  expect(bound()).toBeUndefined();
});
