/**
 * Runs a suite in a real browser instead of a document implementation.
 *
 * @remarks
 *   Nothing here imports the driver at module scope. A repository that never
 *   composes a browser layer can load this module without having playwright
 *   installed at all.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * The engines a browser run can be driven against.
 */
export type Browser = "chromium" | "firefox" | "webkit";

/**
 * The page a test opens at when it asks for no particular size.
 */
const DESKTOP: Viewport = { height: 800, width: 1280 };

/**
 * The Chromium build that ships a browser rather than a headless shell.
 */
const CHROMIUM = "chromium";

/**
 * The area a test renders into, in CSS pixels.
 */
export interface Viewport {
  /**
   * The height of the page.
   */
  height: number;

  /**
   * The width of the page.
   */
  width: number;
}

/**
 * How a repository wants its browser run driven.
 */
export interface Browsed {
  /**
   * The engine to launch. Chromium runs when none is named.
   */
  browser?: Browser;

  /**
   * A named build of that engine, such as a branded Chrome release.
   */
  channel?: string;

  /**
   * Opens a window when false, which is what watching a failure needs.
   */
  headless?: boolean;

  /**
   * The page size. A desktop one is used when this is left out.
   */
  viewport?: Viewport;
}

/**
 * The module the Playwright provider is taken from.
 */
export type Driver = typeof import("@vitest/browser-playwright");

/**
 * Loads the Playwright provider, and says what to install when it is absent.
 *
 * @remarks
 *   Three things have to be present: two packages and a downloaded browser. The
 *   import fails the same way whichever is missing, so the message names all
 *   three rather than guessing at one.
 * @param load - Replaced by a test. The real dynamic import runs when it is
 *   omitted.
 * @throws {@link Error} When the provider cannot be imported.
 */
export async function driver(
  load: () => Promise<Driver> = () => import("@vitest/browser-playwright"),
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
 * Runs the suite in a browser, against the driver that is installed.
 *
 * @remarks
 *   The driver is imported while the configuration resolves rather than when
 *   this returns, so a package that composes the layer needs it installed even
 *   on a run that executes no browser test.
 */
export function browser(stated: Browsed = {}): Preset {
  return browsing(stated);
}

/**
 * Runs the suite in a browser, against the driver a caller hands it.
 *
 * @remarks
 *   Chromium is launched under its full build, because the download the driver
 *   defaults to is a headless shell that paints differently from the browser
 *   anybody would open. An engine shipping one build names none.
 * @param stated - The engine, window, page size and build to drive.
 * @param load - The loader used in place of the real dynamic import.
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
