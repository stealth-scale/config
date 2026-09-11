import { expect, test } from "vite-plus/test";

import { warn } from "#override.ts";

test("takes the check back by name before putting another in its place", () => {
  const held = warn();

  expect(held[0]?.kind).toBe("removal");
  expect(held[0]).toHaveProperty("target", "stylelint.check");
});

test("puts a check back, so a stylesheet is still read", () => {
  expect(warn()[1]?.name).toBe("stylelint.check");
});

test("keeps whatever else was asked for, since warning is not a request for the rules back", () => {
  expect(() => warn({ rules: { "color-no-hex": true } })).not.toThrow();
  expect(warn({ rules: { "color-no-hex": true } })).toHaveLength(2);
});
