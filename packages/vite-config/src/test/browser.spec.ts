import { type ConfigEnv } from "vite-plus";
import { describe, expect, it } from "vitest";

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

describe("browser", () => {
  it("names the browser it drives", () => {
    expect(browser().name).toBe("test.browser(chromium)");
    expect(browser({ browser: "webkit" }).name).toBe("test.browser(webkit)");
  });

  it("loads no driver until it is called", async () => {
    const held = await readBack(defineConfig(AT, { extends: [] }), RUNNING);

    expect(held.test?.browser).toBeUndefined();
  });

  it("turns the browser on and drives the one it was given", async () => {
    expect((await block())["enabled"]).toBe(true);
    expect((await block())["instances"]).toStrictEqual([{ browser: "chromium" }]);
    expect((await block({ browser: "webkit" }))["instances"]).toStrictEqual([
      { browser: "webkit" },
    ]);
  });

  it("runs without a window", async () => {
    expect((await block())["headless"]).toBe(true);
  });

  it("opens a window for somebody watching a test fail", async () => {
    expect((await block({ headless: false }))["headless"]).toBe(false);
  });

  it("opens a desktop-sized page rather than the runner's phone", async () => {
    expect((await block())["viewport"]).toStrictEqual({ height: 800, width: 1280 });
    expect((await block({ viewport: { height: 900, width: 1440 } }))["viewport"]).toStrictEqual({
      height: 900,
      width: 1440,
    });
  });

  it("drives the chromium build rather than the cut-down headless shell", async () => {
    const held = (await block())["provider"] as {
      options?: { launchOptions?: { channel?: string } };
    };

    expect(held.options?.launchOptions?.channel).toBe("chromium");
  });

  it("names no build for a browser that ships only one", async () => {
    const held = (await block({ browser: "webkit" }))["provider"] as {
      options?: { launchOptions?: unknown };
    };

    expect(held.options?.launchOptions).toBeUndefined();
  });

  it("throws naming what to install when the driver cannot be resolved", async () => {
    await expect(driver(() => Promise.reject(new Error("not installed")))).rejects.toThrow(
      /@vitest\/browser-playwright and playwright/u,
    );
  });

  it("resolves the real driver when it is given no loader", async () => {
    await expect(driver()).rejects.toThrow(/@vitest\/browser-playwright and playwright/u);
  });
});
