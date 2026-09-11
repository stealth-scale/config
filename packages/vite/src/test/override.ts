/**
 * Bending what the test block decided, where a repository knows better than the house.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { type UserConfig } from "vite-plus";

import { contribute, type Contribution, type Preset, preset } from "#core/layer.ts";

/**
 * Where a contribution to the list of what coverage leaves out lands.
 */
const AT = "test.coverage.exclude";

/**
 * How much of what is counted has to be reached, as the runner takes it.
 */
type Enough = NonNullable<NonNullable<NonNullable<UserConfig["test"]>["coverage"]>["thresholds"]>;

/**
 * Describes files coverage stops counting.
 */
export interface Uncounted {
  /**
   * Why counting them says nothing, kept with the contribution so a later reader can weigh it.
   */
  because: string;

  /**
   * The globs to stop counting.
   */
  files: readonly string[];
}

/**
 * Stops counting files whose coverage would mean nothing.
 *
 * The conventional ones are left out already. This is for the rest: a file that only exists to be
 * imported by a tool, a shim around something with no behaviour of its own, generated output kept
 * somewhere unconventional.
 *
 * One contribution per glob, each named for the glob it carries, so a later module can take back
 * exactly one rather than the set.
 *
 * @param stated - The globs, and why.
 * @returns One contribution for each glob.
 */
export function uncounted(stated: Uncounted): readonly Contribution[] {
  return stated.files.map((held) =>
    contribute({ at: AT, because: stated.because, item: held, name: `test.uncounted(${held})` }),
  );
}

/**
 * Reads the workspace globs a manifest declares.
 *
 * @param at - The directory holding it.
 * @returns Each glob, however the manifest spells the field.
 * @throws Error Where the manifest declares no workspace, which means this is not a root.
 */
function membership(at: string): readonly string[] {
  const held: unknown = JSON.parse(readFileSync(join(at, "package.json"), "utf8"));
  const stated: unknown =
    typeof held === "object" && held !== null ? Reflect.get(held, "workspaces") : undefined;
  const nested: unknown =
    typeof stated === "object" && stated !== null ? Reflect.get(stated, "packages") : undefined;
  const globs: unknown = Array.isArray(stated) ? stated : nested;

  if (!Array.isArray(globs) || globs.length === 0) {
    throw new Error(
      `test.projects(${at}) found no workspaces in its manifest. It belongs in the config at the ` +
        "root of a workspace, which is the only one that knows what the workspace holds.",
    );
  }

  return globs.filter((glob): glob is string => typeof glob === "string");
}

/**
 * Runs every package in the workspace, each under its own configuration.
 *
 * A workspace root has no tests of its own and every reason to run the ones below it. Left alone it
 * does the opposite: it finds every specification in every package and runs all of them under its
 * own settings, so a package that renders is tested without a document and reports that `document`
 * is not defined.
 *
 * The packages come from the manifest's own `workspaces`, which is already the list. A second copy
 * in this file would be a list to keep in step, and the failure when it drifted would be a package
 * silently not being tested.
 *
 * Each glob names a config file rather than a directory. A directory with no config is still a
 * project as far as the runner is concerned, and one without a manifest has no name — which is how
 * a skeleton directory left for a package nobody has written yet stops the whole run, complaining
 * that every project needs a name of its own.
 *
 * The root stops looking for its own tests, because every one of them belongs to a package and
 * would otherwise run twice: once under the package's settings and once under the root's.
 *
 * @param at - The directory holding the workspace manifest, which is `import.meta.dirname`.
 * @returns The preset.
 */
export function projects(at: string): Preset {
  return preset({
    config: {
      test: { include: [], projects: membership(at).map((glob) => `${glob}/vite.config.ts`) },
    },
    name: "test.projects",
  });
}

/**
 * Describes a file run once around the whole test run.
 */
export interface Global {
  /**
   * Why this repository needs it, kept with the contribution so a later reader can weigh it.
   */
  because: string;

  /**
   * The files, as absolute paths. A relative one is read against the repository being tested rather
   * than against whatever stated it.
   */
  files: readonly string[];
}

/**
 * Runs a file once before the tests, and once after them.
 *
 * For the things a test suite needs standing up rather than mocking: a database, a server, a
 * fixture too expensive to build per file. A setup file runs before every file and is the wrong
 * place for any of them.
 *
 * There is no separate teardown. A file named here exports `setup` and `teardown`, or a default
 * function returning the teardown — one file holding both halves, which is what keeps the thing it
 * started and the thing that stops it from drifting apart.
 *
 * Nothing here ships one. What runs once around a suite is what the suite needs standing up, and a
 * configuration package knows nothing about that.
 *
 * @param stated - The files, and why.
 * @returns One contribution for each file.
 */
export function globalSetup(stated: Global): readonly Contribution[] {
  return stated.files.map((held) =>
    contribute({
      at: "test.globalSetup",
      because: stated.because,
      item: held,
      name: `test.globalSetup(${held})`,
    }),
  );
}

/**
 * Asks for less coverage than the house does.
 *
 * The house asks for all of it, which is the only number that needs no explaining. A repository
 * that cannot hold to it says so here, and what it states wins over what the tier set.
 *
 * Whatever is left out keeps the house's answer, so lowering the branch threshold does not quietly
 * lower the other three.
 *
 * @param stated - The thresholds this repository holds itself to.
 * @returns The preset.
 */
export function covering(stated: Enough): Preset {
  return preset({
    config: { test: { coverage: { thresholds: stated } } },
    name: `test.covering(${Object.keys(stated).join(", ")})`,
  });
}

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
type Driver = typeof import("vite-plus/test/browser-playwright");

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
  const driving = stated.browser ?? "chromium";
  const build = stated.channel ?? (driving === "chromium" ? CHROMIUM : undefined);

  return preset({
    config: async () => {
      const { playwright } = await driver();

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
