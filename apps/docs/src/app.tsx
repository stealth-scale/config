/**
 * Puts everything the catalogue reads in scope, and routes the pages under them.
 */

import { type ReactElement } from "react";

import { catalogues } from "virtual:i18n";
import { pages } from "virtual:specimen-index";

import { RouterProvider } from "@stealthscale/provider-router";
import { Shell } from "@stealthscale/provider-shell";

import { routed } from "#routes.tsx";

/**
 * The application every setting a reader makes is remembered under, so another application on this
 * origin keeps its own.
 */
const APP = "docs";

/**
 * The locales the catalogue offers, the first being the one every key is defined in.
 */
const LOCALES: readonly [string, ...string[]] = ["en"];

/**
 * The router over the pages this build indexed, built once for the life of the page.
 */
const ROUTER = routed(pages);

/**
 * Draws the catalogue with the colour mode, theme, locale, viewport and shortcuts in scope.
 *
 * @remarks
 *   One provider rather than seven, because the order they nest in is knowledge the shell already
 *   holds. The chrome reads all of it: a theme switcher moves `Themed`, a colour-mode toggle moves
 *   `ColorModeProvider` and a width switcher moves `ViewportProvider`, none of which this file
 *   states again.
 */
export function App(): ReactElement {
  return (
    <Shell app={APP} catalogues={catalogues} locales={LOCALES}>
      <RouterProvider router={ROUTER} />
    </Shell>
  );
}
