/**
 * The page the host owns, and the hole it leaves for what it loads.
 */

import { type ReactElement, type ReactNode } from "react";

import { Panel } from "@stealthscale/example-lib-ui";

/**
 * Describes what the host draws around.
 */
export interface ShellProps {
  /**
   * What the loaded application drew, or what to show while it has not.
   */
  children: ReactNode;
}

/**
 * Draws the host's own page around whatever it was handed.
 *
 * The loaded application arrives as an element rather than being imported here, so what this draws
 * can be specified without a remote running.
 *
 * @param props - The element to draw inside. `ShellProps` documents every member.
 * @returns The element.
 */
export function Shell({ children }: ShellProps): ReactElement {
  return (
    <main>
      <Panel title="Host">{"This page is the host."}</Panel>
      <div id="remote">{children}</div>
    </main>
  );
}
