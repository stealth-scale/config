/**
 * Draws what this application shows, whether it owns the page or a host loaded it.
 */

import { type ReactElement } from "react";

import { Panel } from "@stealthscale/example-lib-ui";

/**
 * Carries the count the dashboard reports.
 */
export interface DashboardProps {
  /**
   * How many items are open.
   */
  count: number;
}

/**
 * Reports a count inside the panel every application in this example draws with.
 *
 * @remarks
 *   The panel comes from a shared library rather than from markup written here, which is what
 *   keeps a host and its remotes looking like one product. A host that shares the library gets one
 *   copy of it at runtime instead of two.
 */
export function Dashboard(props: DashboardProps): ReactElement {
  return <Panel title="Dashboard">{`${String(props.count)} open`}</Panel>;
}
