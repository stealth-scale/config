/**
 * What this application draws at its own address.
 */

import { type ReactElement } from "react";

import { Panel } from "@stealthscale/example-lib-ui";

/**
 * Draws the page this application owns outright.
 *
 * @returns The element.
 */
export function Home(): ReactElement {
  return <Panel title="Home">{"This application owns this page."}</Panel>;
}
