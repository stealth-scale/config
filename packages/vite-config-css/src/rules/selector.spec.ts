/**
 * Checks that the selector set still refuses an id and a qualified class.
 */

import { describe, expect, it } from "vitest";

import { SELECTOR } from "#rules/selector.ts";

describe("selector", () => {
  it("rejects every id selector", () => {
    expect(SELECTOR["selector-max-id"]).toBe(0);
  });

  it("rejects a class tied to an element", () => {
    expect(SELECTOR["selector-no-qualifying-type"]).toBe(true);
  });
});
