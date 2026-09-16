/**
 * Proves the preview headers are sent, copied, and stop short of a deployment's
 * own.
 */

import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { headers } from "#preview/headers.ts";

/**
 * Reads the header table out of a freshly built layer.
 */
function answered(): Record<string, string> {
  return (headers().config as UserConfig).preview?.headers as Record<string, string>;
}

describe("headers", () => {
  it("stops a browser guessing a type the server already declared", () => {
    expect(answered()["X-Content-Type-Options"]).toBe("nosniff");
  });

  it("keeps the application out of another origin's frame", () => {
    expect(answered()["X-Frame-Options"]).toBe("SAMEORIGIN");
  });

  it("stops sending the path to another origin", () => {
    expect(answered()["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
  });

  it("declares nothing needing a value only a deployment knows", () => {
    const held = Object.keys(answered());

    expect(held).not.toContain("Content-Security-Policy");
    expect(held).not.toContain("Strict-Transport-Security");
  });

  it("copies the headers it sets", () => {
    expect(answered()).not.toBe((headers().config as UserConfig).preview?.headers);
  });

  it("names the layer so a repository can remove it", () => {
    expect(headers().name).toBe("preview.headers");
  });
});
