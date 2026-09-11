import { expect, test } from "vite-plus/test";

import { bound, hosts, origins } from "#serving/environment.ts";
import { told } from "#vite.fixtures.ts";

test("reads the names the machine says its servers answer to", () => {
  const held = told({ env: { STEALTH_HOSTS: "app1.example.test,app2.example.test" } });

  expect(hosts(held)).toEqual(["app1.example.test", "app2.example.test"]);
});

test("reads the origins allowed to fetch from it, which is a different list", () => {
  const held = told({ env: { STEALTH_ORIGINS: "https://host.example.test" } });

  expect(origins(held)).toEqual(["https://host.example.test"]);
});

test("answers none where neither the machine nor the repository names any", () => {
  expect(hosts(told())).toEqual([]);
});

test("answers what the repository states where the machine states nothing", () => {
  expect(hosts(told(), ["stated.example.test"])).toEqual(["stated.example.test"]);
});

test("replaces what the repository states rather than adding to it", () => {
  const held = told({ env: { STEALTH_HOSTS: "machine.example.test" } });

  expect(hosts(held, ["stated.example.test"])).toEqual(["machine.example.test"]);
});

test("replaces the stated origins the same way, the two lists being read alike", () => {
  const held = told({ env: { STEALTH_ORIGINS: "https://machine.example.test" } });

  expect(origins(held, ["https://stated.example.test"])).toEqual(["https://machine.example.test"]);
});

test("drops the empties, so a trailing comma names nothing", () => {
  expect(hosts(told({ env: { STEALTH_HOSTS: "a.example.test,," } }))).toEqual(["a.example.test"]);
});

test("binds IPv4 loopback once names are in play, which is what they resolve to", () => {
  expect(bound(told({ env: { STEALTH_HOSTS: "a.example.test" } }))).toBe("127.0.0.1");
});

test("binds it for a name the repository stated too, the default bind being wrong either way", () => {
  expect(bound(told(), ["stated.example.test"])).toBe("127.0.0.1");
});

test("leaves the server on its own answer where no name is in play", () => {
  expect(bound(told())).toBeUndefined();
});
