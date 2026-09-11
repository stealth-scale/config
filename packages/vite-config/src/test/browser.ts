/**
 * Running the tests in a real browser rather than against a document implementation.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * The browsers Playwright drives.
 *
 * Written out rather than imported, because the type comes from a package a repository installs
 * only if it asks for a browser.
 */
export type Browser = "chromium" | "firefox" | "webkit";

/**
 * How large the page is when a test opens it.
 *
 * The runner's own answer is 414 by 896, which is a phone held upright. A component tested at that
 * width meets whatever the stylesheet does below its first breakpoint, which is rarely what the
 * author was testing and never what they said.
 */
const DESKTOP: Viewport = { height: 800, width: 1280 };

/**
 * The Chromium build to drive.
 *
 * Playwright reaches for a headless shell by default, which is a cut-down build. Naming the channel
 * asks for the browser a person would open.
 */
const CHROMIUM = "chromium";

/**
 * How large a page is.
 */
export interface Viewport {
  /**
   * The page height, in pixels.
   */
  height: number;

  /**
   * The page width, in pixels.
   */
  width: number;
}

/**
 * Describes a run in a real browser.
 */
export interface Browsed {
  /**
   * Which browser to drive. One of the three Playwright ships.
   */
  browser?: Browser;

  /**
   * Which build of it to drive, where the browser has more than one.
   *
   * Chromium is driven as `chromium` rather than as the headless shell Playwright reaches for on
   * its own, because the shell is a cut-down build and a test that passes on it can still fail on
   * what a person opens. A repository shipping to one particular build names it here: `chrome`,
   * `msedge`.
   *
   * Meaningless for the other two, which ship one build each, so nothing is passed for them.
   */
  channel?: string;

  /**
   * Whether to run without opening a window. Headless by default.
   */
  headless?: boolean;

  /**
   * How large the page is. Defaults to a desktop window rather than a phone.
   */
  viewport?: Viewport;
}

/**
 * The browser driver, as the package that ships it declares.
 */
export type Driver = typeof import("vite-plus/test/browser-playwright");

/**
 * Loads the browser driver, and says what to install where it is missing.
 *
 * Which loader it calls is an argument so that the failure a repository without those packages
 * meets is reachable from a specification here, where they are installed.
 *
 * @param load - How to reach the driver. The real import unless a specification says otherwise.
 * @returns Playwright's provider, ready to be handed to the runner.
 * @throws Error Where the optional packages a browser run needs are not installed.
 */
export async function driver(
  load: () => Promise<Driver> = () => import("vite-plus/test/browser-playwright"),
): Promise<Driver> {
  try {
    return await load();
  } catch {
    throw new Error(
      "test.browser() needs @vitest/browser-playwright and playwright installed, and a browser " +
        "downloaded with `playwright install`. Both are optional, because a repository that tests " +
        "against a document implementation needs neither.",
    );
  }
}

/**
 * Runs the tests in a real browser rather than against a document implementation.
 *
 * Off unless asked for, and asked for rarely: a browser is slower than `happy-dom` by an order of
 * magnitude and needs one downloaded before anything runs. What it buys is the part a document
 * implementation cannot answer — layout, real events, and what a stylesheet actually computes.
 *
 * The provider is imported when this is called rather than when the block is loaded. It lives in a
 * package that is an optional peer, so importing it at the top of this file would make every
 * repository install a browser driver to configure anything at all.
 *
 * Headless, which the runner is not on its own: it opens a window when a person is watching and
 * hides it otherwise, so a run behaves one way on a laptop and another in continuous integration.
 * One answer everywhere, and a person watching a test fail passes `headless: false`.
 *
 * @param stated - The browser and the page size. `Browsed` documents every member.
 * @returns The preset.
 */
export function browser(stated: Browsed = {}): Preset {
  return browsing(stated);
}

/**
 * States the browser block, reaching the driver through whichever loader it was given.
 *
 * Separate from `browser` so that the loader stays out of the published surface. A repository
 * configuring a browser run passes a browser and a page size and nothing else; this repository
 * installs no driver, so its own specification hands over one that answers without importing.
 *
 * @param stated - The browser and the page size. `Browsed` documents every member.
 * @param load - How to reach the driver. The real import unless a specification says otherwise.
 * @returns The preset.
 */
export function browsing(stated: Browsed, load?: () => Promise<Driver>): Preset {
  const driving = stated.browser ?? "chromium";
  const build = stated.channel ?? (driving === "chromium" ? CHROMIUM : undefined);

  return preset({
    config: async () => {
      const { playwright } = await driver(load);

      return {
        test: {
          browser: {
            enabled: true,
            headless: stated.headless ?? true,
            instances: [{ browser: driving }],
            provider: playwright(build === undefined ? {} : { launchOptions: { channel: build } }),
            viewport: stated.viewport ?? DESKTOP,
          },
        },
      };
    },
    name: `test.browser(${driving})`,
  });
}
