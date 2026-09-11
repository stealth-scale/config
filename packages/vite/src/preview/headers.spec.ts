import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { headers } from "#preview/headers.ts";

/**
 * Reads back the headers a preview answers with.
 *
 * @returns Each header against its value.
 */
function answered(): Record<string, string> {
  return (headers().config as UserConfig).preview?.headers as Record<string, string>;
}

test("refuses to let a browser guess a type the server already stated", () => {
  expect(answered()["X-Content-Type-Options"]).toBe("nosniff");
});

test("keeps the application out of another origin's frame", () => {
  expect(answered()["X-Frame-Options"]).toBe("SAMEORIGIN");
});

test("stops sending the path to another origin, which is where a token in one leaks", () => {
  expect(answered()["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
});

test("states nothing needing a value only a deployment knows", () => {
  const held = Object.keys(answered());

  expect(held).not.toContain("Content-Security-Policy");
  expect(held).not.toContain("Strict-Transport-Security");
});

test("copies what it states, so one repository's headers are not another's", () => {
  expect(answered()).not.toBe((headers().config as UserConfig).preview?.headers);
});

test("names itself, so a repository answering differently can take the layer back", () => {
  expect(headers().name).toBe("preview.headers");
});
