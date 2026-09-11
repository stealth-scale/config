/**
 * Stands in for the other application while the tests run.
 *
 * `remote/Dashboard` is a module the federation plugin invents during a build or a dev server, so
 * nothing resolves it under the test runner and a specification reaching any module that imports it
 * fails to load at all. The runner is pointed here instead, which is also the only way to specify
 * what this application does when the other one answers something in particular.
 */

import { type ReactElement } from "react";

/**
 * Describes what the other application reports.
 */
export interface DashboardProps {
  /**
   * How many of them there are.
   */
  count: number;
}

/**
 * Draws what the other application would draw.
 *
 * @param props - The count to report. `DashboardProps` documents every member.
 * @returns The element.
 */
export function Dashboard(props: DashboardProps): ReactElement {
  return <section className="panel">{`${String(props.count)} open`}</section>;
}
