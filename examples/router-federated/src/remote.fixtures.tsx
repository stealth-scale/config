/**
 * Stands in for the module the other deployment exposes while tests run.
 *
 * @remarks
 *   The test runner has no second deployment to fetch a remote from, and the federation layer
 *   aliases `remote/Dashboard` here instead. Nothing imports this module directly, and no build of
 *   the application includes it.
 */

import { type ReactElement } from "react";

/**
 * What the stand-in dashboard is told to report on, matching the remote's declaration.
 */
export interface DashboardProps {
  /**
   * How many items the dashboard counts as open.
   */
  count: number;
}

/**
 * Draws the count inside the class name the real dashboard's panel carries.
 *
 * @remarks
 *   A test reads the count out of the rendered text, so the wording follows the remote's rather
 *   than saying anything of its own. The panel is written out here instead of imported, which
 *   keeps the stand-in free of whatever the shared library does next.
 */
export function Dashboard(props: DashboardProps): ReactElement {
  return <section className="panel">{`${String(props.count)} open`}</section>;
}
