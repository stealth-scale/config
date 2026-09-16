/**
 * Proves a development server's address layers arrive together and stay
 * separable.
 */

import { describe, expect, it } from "vitest";

import { address } from "#server/address.ts";

describe("address", () => {
  it("sets the port the names and the address together", () => {
    expect(address(4400, ["a.example.test"]).map((one) => one.name)).toStrictEqual([
      "server.port(4400)",
      "server.reachable(a.example.test)",
      "server.bound(a.example.test)",
    ]);
  });

  it("keeps each under its own name", () => {
    for (const held of address(4400, ["a.example.test"])) {
      expect(held.name.startsWith("server.")).toBe(true);
    }
  });

  it("sets the port alone when no name is given", () => {
    expect(address(4400).map((one) => one.name)).toContain("server.port(4400)");
  });
});
