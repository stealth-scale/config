import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { SOURCE } from "#resolve/condition.ts";
import { source } from "#resolve/source.ts";

/**
 * Reads the config the preset sets.
 *
 * @returns That config.
 */
function configOf(): UserConfig {
  return source().config as UserConfig;
}

test("puts the source condition first, so it wins over a built entry", () => {
  expect(configOf().resolve?.conditions?.[0]).toBe(SOURCE);
});

test("sets the resolver node runs under as well, which is the one a specification uses", () => {
  expect(configOf().ssr?.resolve?.conditions?.[0]).toBe(SOURCE);
});

test("keeps the bundler's own conditions, since setting the key replaces the list", () => {
  expect(configOf().resolve?.conditions?.length).toBeGreaterThan(1);
  expect(configOf().ssr?.resolve?.conditions?.length).toBeGreaterThan(1);
});

test("gives the two resolvers different lists, because they are different resolvers", () => {
  expect(configOf().resolve?.conditions).not.toEqual(configOf().ssr?.resolve?.conditions);
});
