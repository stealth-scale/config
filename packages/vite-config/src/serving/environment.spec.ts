/**
 * Checks how a machine's host names beat the ones a repository declares.
 */

import { describe, expect, it } from "vitest";

import { bound, hosts, origins } from "#serving/environment.ts";
import { told } from "#vite.fixtures.ts";

describe("environment", () => {
  it("reads the host names the machine declares", () => {
    const held = told({ env: { STEALTH_HOSTS: "app1.example.test,app2.example.test" } });

    expect(hosts(held)).toStrictEqual(["app1.example.test", "app2.example.test"]);
  });

  it("reads the origins allowed to fetch from it", () => {
    const held = told({ env: { STEALTH_ORIGINS: "https://host.example.test" } });

    expect(origins(held)).toStrictEqual(["https://host.example.test"]);
  });

  it("returns none when neither the machine nor the repository names any", () => {
    expect(hosts(told())).toStrictEqual([]);
  });

  it("returns what the repository declares when the machine declares nothing", () => {
    expect(hosts(told(), ["stated.example.test"])).toStrictEqual(["stated.example.test"]);
  });

  it("replaces what the repository declares rather than adding to it", () => {
    const held = told({ env: { STEALTH_HOSTS: "machine.example.test" } });

    expect(hosts(held, ["stated.example.test"])).toStrictEqual(["machine.example.test"]);
  });

  it("replaces the stated origins the same way", () => {
    const held = told({ env: { STEALTH_ORIGINS: "https://machine.example.test" } });

    expect(origins(held, ["https://stated.example.test"])).toStrictEqual([
      "https://machine.example.test",
    ]);
  });

  it("drops the empty entries", () => {
    expect(hosts(told({ env: { STEALTH_HOSTS: "a.example.test,," } }))).toStrictEqual([
      "a.example.test",
    ]);
  });

  it("binds IPv4 loopback once names are given", () => {
    expect(bound(told({ env: { STEALTH_HOSTS: "a.example.test" } }))).toBe("127.0.0.1");
  });

  it("binds it for a name the repository declared too", () => {
    expect(bound(told(), ["stated.example.test"])).toBe("127.0.0.1");
  });

  it("leaves the server on its own address when no name is given", () => {
    expect(bound(told())).toBeUndefined();
  });
});
