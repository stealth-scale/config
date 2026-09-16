/**
 * Declares the module the other deployment exposes, so an import of it type-checks here.
 *
 * @remarks
 *   Nothing in this application builds that module, and this declaration is all the compiler knows
 *   about it. Where it drifts from what the other deployment actually exposes, the mismatch
 *   surfaces when a visitor opens the route rather than when the build runs.
 */

declare module "remote/Dashboard" {
  import { type ReactElement } from "react";

  /**
   * Tells the remote dashboard how many items to report on.
   */
  export interface DashboardProps {
    /**
     * How many items the dashboard counts as open.
     */
    count: number;
  }

  /**
   * Draws the other deployment's dashboard.
   */
  export function Dashboard(props: DashboardProps): ReactElement;
}
