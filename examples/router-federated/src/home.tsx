/**
 * Draws the page this application serves out of its own bundle.
 */

import { type ReactElement } from "react";

import { Panel } from "@stealthscale/example-lib-ui";

/**
 * Draws the panel that names this application as the page's owner.
 *
 * @remarks
 *   The panel comes from the library both deployments draw with, so this page and the remote
 *   dashboard look the same to a visitor moving between them.
 */
export function Home(): ReactElement {
  return <Panel title="Home">{"This application owns this page."}</Panel>;
}
