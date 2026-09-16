/**
 * Declares the modules the remote applications expose, so the type checker can resolve them.
 *
 * @remarks
 *   The federation plugin can generate these by compiling a remote's types and serving them for a
 *   host to fetch, which needs that remote running whenever this application is type checked. One
 *   declaration per exposed module costs less and drifts only when the remote's props change.
 */

declare module "remote/Dashboard" {
  import { type ReactElement } from "react";

  /**
   * Carries the count the remote's dashboard reports.
   */
  export interface DashboardProps {
    /**
     * How many items are open.
     */
    count: number;
  }

  /**
   * Reports a count inside the panel both applications draw with.
   *
   * @remarks
   *   The module is fetched over the network when the import is first reached, so this signature
   *   is a promise the remote's own build has to keep. Nothing checks the two against each other.
   */
  export function Dashboard(props: DashboardProps): ReactElement;
}
