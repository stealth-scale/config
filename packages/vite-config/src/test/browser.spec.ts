import { type ConfigEnv } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { defineConfig } from "@stealthscale/vite-config-core";

import { readBack } from "#preset/preset.fixtures.ts";
import { type Browsed, browser, browsing, type Driver, driver } from "#test/browser.ts";

/**
 * Where the config under specification is, which every `defineConfig` states for itself.
 */
const AT = import.meta.dirname;

/**
 * The environment a test run is read in.
 */
const RUNNING: ConfigEnv = { command: "serve", mode: "test" };

/**
 * Stands in for the driver, which this repository installs for nothing.
 *
 * Answers what the block hands the runner rather than a running browser, so what is read back is
 * the options this layer passed. Whether Playwright accepts them is Playwright's contract.
 *
 * @returns The driver, as far as the block reads it.
 */
function driving(): Promise<Driver> {
  return Promise.resolve({
    playwright: (options: unknown) => ({ name: "playwright", options }),
  } as unknown as Driver);
}

/**
 * Reads the browser block back once the layers have composed.
 *
 * @param stated - What the repository asked for.
 * @returns That block.
 */
async function block(stated: Browsed = {}): Promise<Record<string, unknown>> {
  const held = await readBack(defineConfig(AT, { extends: [browsing(stated, driving)] }), RUNNING);

  return held.test?.browser as unknown as Record<string, unknown>;
}

test("names the browser it drives, so a repository can take one back", () => {
  expect(browser().name).toBe("test.browser(chromium)");
  expect(browser({ browser: "webkit" }).name).toBe("test.browser(webkit)");
});

test("asks for no driver until it is called, so the peer stays optional", async () => {
  const held = await readBack(defineConfig(AT, { extends: [] }), RUNNING);

  expect(held.test?.browser).toBeUndefined();
});

test("turns the browser on and drives the one it was given", async () => {
  expect((await block())["enabled"]).toBe(true);
  expect((await block())["instances"]).toEqual([{ browser: "chromium" }]);
  expect((await block({ browser: "webkit" }))["instances"]).toEqual([{ browser: "webkit" }]);
});

test("runs without a window, so a laptop and a build server behave the same", async () => {
  expect((await block())["headless"]).toBe(true);
});

test("opens a window for somebody watching a test fail", async () => {
  expect((await block({ headless: false }))["headless"]).toBe(false);
});

test("opens a desktop-sized page rather than the runner's phone", async () => {
  expect((await block())["viewport"]).toEqual({ height: 800, width: 1280 });
  expect((await block({ viewport: { height: 900, width: 1440 } }))["viewport"]).toEqual({
    height: 900,
    width: 1440,
  });
});

test("drives the chromium build rather than the cut-down headless shell", async () => {
  const held = (await block())["provider"] as {
    options?: { launchOptions?: { channel?: string } };
  };

  expect(held.options?.launchOptions?.channel).toBe("chromium");
});

test("names no build for a browser that ships only one", async () => {
  const held = (await block({ browser: "webkit" }))["provider"] as {
    options?: { launchOptions?: unknown };
  };

  expect(held.options?.launchOptions).toBeUndefined();
});

test("says what to install when reaching the driver fails", async () => {
  await expect(driver(() => Promise.reject(new Error("not installed")))).rejects.toThrow(
    /@vitest\/browser-playwright and playwright/u,
  );
});

test("reaches for the real driver when nothing hands it one, and finds none here", async () => {
  await expect(driver()).rejects.toThrow(/@vitest\/browser-playwright and playwright/u);
});
