/**
 * Draws a list that rises in turn, and a button that runs it again.
 *
 * @remarks
 *   The `rise` motion reads `--stagger` off the element and delays itself by that many steps, so
 *   each riser carries its place as a class of its own. The list runs again by mounting under a
 *   new key, which is how a motion that runs once is run again.
 */

import { type ReactElement, useState } from "react";

import { Button } from "@stealthscale/example-lib-actions";
import { css, cx } from "@stealthscale/theme";

/**
 * Lays the list and the button out in a row.
 */
const row = css({ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "gap.md" });

/**
 * Lays the risers out as a column without bullets.
 */
const list = css({ display: "flex", flexDirection: "column", gap: "gap.xs", listStyle: "none" });

/**
 * Draws one riser, which rises in its turn.
 */
const riser = css({ animationStyle: "rise" });

/**
 * Lists the three risers, each by the class that states its place in the stagger.
 */
const RISERS: ReadonlyArray<readonly [label: string, place: string]> = [
  ["First to rise", css({ "--stagger": "0" })],
  ["Second to rise", css({ "--stagger": "1" })],
  ["Third to rise", css({ "--stagger": "2" })],
];

/**
 * Draws the rising list.
 */
export function Rising(): ReactElement {
  const [run, setRun] = useState(0);

  return (
    <div className={row}>
      <ul className={list} key={run}>
        {RISERS.map(([label, place]) => (
          <li className={cx(riser, place)} key={label}>
            {label}
          </li>
        ))}
      </ul>
      <Button
        onClick={() => {
          setRun(run + 1);
        }}
        variant="subtle"
      >
        Replay
      </Button>
    </div>
  );
}
