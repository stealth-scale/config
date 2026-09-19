/**
 * Builds the toolbar a part's specification needs above it.
 */

import { type ReactElement, type ReactNode } from "react";

import { Center } from "#toolbar/center.ts";
import { End } from "#toolbar/end.ts";
import { Item } from "#toolbar/item.tsx";
import { Root, type RootProps } from "#toolbar/root.tsx";
import { Start } from "#toolbar/start.ts";

/**
 * Describes what a case sets on the row, less the name the fixture already states.
 */
export type Settings = Omit<RootProps, "aria-label">;

/**
 * Draws whatever a case wants measured inside the row that hands down the variants.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the row.
 * @returns The row, holding it.
 */
export function ranged(children: ReactNode, props: Settings = {}): ReactElement {
  return (
    <Root aria-label="Invoice" {...props}>
      {children}
    </Root>
  );
}

/**
 * Draws a whole toolbar, so a case can read how its bands are placed.
 *
 * @param props - Whatever the case sets on the row.
 * @returns The parts composed the way a caller composes them.
 */
export function composed(props: Settings = {}): ReactElement {
  return (
    <Root aria-label="Invoice" {...props}>
      <Start>
        <Item>Filter</Item>
      </Start>
      <Center>April</Center>
      <End>
        <Item>Download</Item>
      </End>
    </Root>
  );
}
