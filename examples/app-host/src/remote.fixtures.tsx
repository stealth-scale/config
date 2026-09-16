/**
 * Substitutes for the remote's dashboard while the specifications run.
 *
 * @remarks
 *   The federation plugin invents `remote/Dashboard` during a build and a dev server, so the test
 *   runner cannot resolve it and any specification reaching a module that imports it fails to
 *   load. The runner resolves the name here instead, which is also the only way to fix what the
 *   remote answers with.
 */

import { type ReactElement } from "react";

/**
 * Mirrors the props the real remote declares, so a mismatch shows up as a type error.
 */
export interface DashboardProps {
  /**
   * How many items are open.
   */
  count: number;
}

/**
 * Stands in for the remote's dashboard, down to the class name its panel carries.
 *
 * @remarks
 *   The markup is written out rather than taken from the shared library, so a specification that
 *   passes here says the host wired the remote up and nothing about how the library renders.
 */
export function Dashboard(props: DashboardProps): ReactElement {
  return <section className="panel">{`${String(props.count)} open`}</section>;
}
