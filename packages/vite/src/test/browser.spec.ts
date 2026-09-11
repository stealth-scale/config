import { type ConfigEnv } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { defineConfig } from "#core/define.ts";
import { readBack } from "#preset/preset.fixtures.ts";
import { type Browsed, browser, driver } from "#test/browser.ts";

/**
 * The environment a test run is read in.
 */
const RUNNING: ConfigEnv = { command: "serve", mode: "test" };

/**
 * Reads the browser block back once the layers have composed.
 *
 * @param stated - What the repository asked for.
 * @returns That block.
 */
async function block(stated: Browsed = {}): Promise<Record<string, unknown>> {
  const held = await readBack(defineConfig({ extends: [browser(stated)] }), RUNNING);

  return held.test?.browser as unknown as Record<string, unknown>;
}

test("names the browser it drives, so a repository can take one back", () => {
  expect(browser().name).toBe("test.browser(chromium)");
  expect(browser({ browser: "webkit" }).name).toBe("test.browser(webkit)");
});

test("asks for no driver until it is called, so the peer stays optional", async () => {
  const held = await readBack(defineConfig({ extends: [] }), RUNNING);

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
