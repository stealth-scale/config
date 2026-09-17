/**
 * Proves both resolvers try source first and keep their own defaults below it.
 */

import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { SOURCE } from "#resolve/condition.ts";
import { source } from "#resolve/source.ts";

/**
 * Reads the configuration out of a freshly built layer.
 */
function configOf(): UserConfig {
  return source().config as UserConfig;
}

describe("source", () => {
  it("puts the source condition first", () => {
    expect(configOf().resolve?.conditions?.[0]).toBe(SOURCE);
  });

  it("sets the node resolver as well", () => {
    expect(configOf().ssr?.resolve?.conditions?.[0]).toBe(SOURCE);
  });

  it("keeps the bundler's own conditions", () => {
    expect(configOf().resolve?.conditions?.length).toBeGreaterThan(1);
    expect(configOf().ssr?.resolve?.conditions?.length).toBeGreaterThan(1);
  });

  it("gives the two resolvers different lists", () => {
    expect(configOf().resolve?.conditions).not.toStrictEqual(configOf().ssr?.resolve?.conditions);
  });
});
