/**
 * The page the host owns, and the hole it leaves for what it loads.
 */

import { type ReactElement, useRef } from "react";

import { Panel } from "@stealthscale/example-lib-ui";

/**
 * Draws the host's own page around an element the loaded application draws into.
 *
 * The hole is a plain element rather than anything React owns, because what fills it is another
 * application with its own React root. Two roots on one element is the one arrangement that breaks,
 * so the host draws the box and hands over what is inside it.
 *
 * @returns The element.
 */
export function Shell(): ReactElement {
  const hole = useRef<HTMLDivElement>(null);

  return (
    <main>
      <Panel title="Host">{"This page is the host."}</Panel>
      <div id="remote" ref={hole} />
    </main>
  );
}
