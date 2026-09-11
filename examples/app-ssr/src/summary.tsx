/**
 * What this application draws, on a server first and in a browser after.
 */

import { type ReactElement } from "react";

import { Panel } from "@stealthscale/example-lib-ui";

/**
 * Describes what the summary reports.
 */
export interface SummaryProps {
  /**
   * What the summary is about.
   */
  subject: string;
}

/**
 * Reports its subject inside the shared panel.
 *
 * Nothing here knows which side it is drawn on, which is the whole point: the server renders it to
 * text and the browser renders the same component over that text. A component that reached for
 * `document` would render on one side and throw on the other.
 *
 * @param props - The subject. `SummaryProps` documents every member.
 * @returns The element.
 */
export function Summary(props: SummaryProps): ReactElement {
  return <Panel title="Summary">{`Rendered on a server: ${props.subject}.`}</Panel>;
}
