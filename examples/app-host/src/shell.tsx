/**
 * Draws the page the host owns, and the region it hands to whatever it loads.
 */

import { type ReactElement, type ReactNode } from "react";

import { Panel } from "@stealthscale/example-lib-ui";

/**
 * Carries what the host surrounds.
 */
export interface ShellProps {
  /**
   * Supplies whatever the loaded application drew, or a placeholder until it does.
   */
  children: ReactNode;
}

/**
 * Frames the host's own panel around a named region the loaded application draws into.
 *
 * @remarks
 *   Children arrive as an element rather than being imported here, so this renders under the test
 *   runner with no remote running. The region carries an id, which is how a test on the finished
 *   page finds what the remote drew.
 */
export function Shell({ children }: ShellProps): ReactElement {
  return (
    <main>
      <Panel title="Host">{"This page is the host."}</Panel>
      <div id="remote">{children}</div>
    </main>
  );
}
