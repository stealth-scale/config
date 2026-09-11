/**
 * What the applications this one loads hand over.
 *
 * Written by hand because the federation plugin's type generation is off: it compiles a remote's
 * types and serves them for a host to fetch, which needs the remote running while this is type
 * checked. One declaration per exposed module is cheaper than that.
 */

declare module "remote/Dashboard" {
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
   * Reports a count inside the panel both applications share.
   *
   * @param props - The count to report. `DashboardProps` documents every member.
   * @returns The element.
   */
  export function Dashboard(props: DashboardProps): ReactElement;
}
