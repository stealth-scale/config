/**
 * What this application draws, wherever it is drawn.
 */

import { type ReactElement } from "react";

import { Panel } from "@stealthscale/example-lib-ui";

/**
 * Describes what the dashboard reports.
 */
export interface DashboardProps {
  /**
   * How many of them there are.
   */
  count: number;
}

/**
 * Reports a count inside the shared panel.
 *
 * @param props - The count to report. `DashboardProps` documents every member.
 * @returns The element.
 */
export function Dashboard(props: DashboardProps): ReactElement {
  return <Panel title="Dashboard">{`${String(props.count)} open`}</Panel>;
}
