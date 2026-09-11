import { expect, test } from "vite-plus/test";

import { check } from "#plugin/check.ts";

test("appends to the list of plugins rather than replacing whatever else is there", () => {
  expect(check().at).toBe("plugins");
});

test("is named so a repository checking its stylesheets another way can take it back", () => {
  expect(check().name).toBe("stylelint.check");
});

test("says why, which is the thing the type checker cannot do", () => {
  expect(check().because).toContain("type checker");
});

test("carries a plugin for the bundler to run", () => {
  expect(check().item).toBeDefined();
});

test("checks the extra globs a repository names, on top of the ones it reaches already", () => {
  expect(() => check({ also: ["**/*.module.css"] })).not.toThrow();
  expect(check({ also: ["**/*.module.css"] }).item).toBeDefined();
});

test("leaves alone the globs a repository names, whatever else it checks", () => {
  expect(check({ except: ["vendor/**"] }).item).toBeDefined();
});
