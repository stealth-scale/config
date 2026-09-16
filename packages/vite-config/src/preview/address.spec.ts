/**
 * Proves a preview server's address layers arrive together and stay under its
 * own key.
 */

import { describe, expect, it } from "vitest";

import { address } from "#preview/address.ts";

describe("address", () => {
  it("sets the port the names and the address together", () => {
    expect(address(4401, ["a.example.test"]).map((one) => one.name)).toStrictEqual([
      "preview.port(4401)",
      "preview.reachable(a.example.test)",
      "preview.bound(a.example.test)",
    ]);
  });

  it("keeps the dev server settings", () => {
    for (const held of address(4401, ["a.example.test"])) {
      expect(held.name.startsWith("preview.")).toBe(true);
    }
  });

  it("sets the port alone when no name is given", () => {
    expect(address(4401).map((one) => one.name)).toContain("preview.port(4401)");
  });
});
