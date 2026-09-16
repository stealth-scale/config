/**
 * Draws the one component the server pass renders and the browser pass hydrates.
 */

import { type ReactElement } from "react";

import { Panel } from "@stealthscale/example-lib-ui";

/**
 * Carries the subject a summary prints.
 */
export interface SummaryProps {
  /**
   * The thing being summarised, printed as it was given.
   */
  subject: string;
}

/**
 * Draws a titled panel naming the subject it was handed.
 *
 * @remarks
 *   Both passes render this component, so it reads nothing off the document and nothing off a
 *   clock. A value that differs between the two makes React throw the server's markup away and
 *   draw the tree again in the browser.
 */
export function Summary(props: SummaryProps): ReactElement {
  return <Panel title="Summary">{`Rendered on a server: ${props.subject}.`}</Panel>;
}
