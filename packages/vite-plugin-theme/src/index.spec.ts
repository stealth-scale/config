/**
 * Pins the names the entry point exports.
 */

import { describe, expect, it } from "vitest";

import * as published from "#index.ts";

describe("vite-plugin-theme", () => {
  it("exports the theme namespace and the two naming constants", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual([
      "SEPARATOR",
      "THEME_ATTRIBUTE",
      "theme",
    ]);
    expect(Object.keys(published.theme).toSorted()).toStrictEqual(["runtime", "stylesheet"]);
  });
});
