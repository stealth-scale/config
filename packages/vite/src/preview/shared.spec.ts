import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { shared } from "#preview/shared.ts";

/**
 * Reads back the origins a layer allows.
 *
 * @param origins - The origins stated.
 * @returns The origins the preview answers.
 */
function allowed(origins: readonly string[]): string[] {
  const held = (shared(origins).config as UserConfig).preview?.cors as { origin: string[] };

  return held.origin;
}

test("lets the origins it was given fetch what the preview serves", () => {
  expect(allowed(["http://localhost:4200"])).toEqual(["http://localhost:4200"]);
});

test("takes more than one, an application loaded by two hosts naming both", () => {
  expect(allowed(["http://localhost:4200", "http://localhost:4400"])).toHaveLength(2);
});

test("copies what it was given, so a caller's list is not the server's", () => {
  const origins = ["http://localhost:4200"];

  expect(allowed(origins)).not.toBe(origins);
});

test("names the origins, so provenance says who was let in", () => {
  expect(shared(["http://localhost:4200"]).name).toBe("preview.shared(http://localhost:4200)");
});
