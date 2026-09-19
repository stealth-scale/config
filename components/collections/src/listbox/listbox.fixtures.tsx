/**
 * Builds the listbox a part's specification needs above it, every part reading one machine.
 */

import { type ReactElement, type ReactNode } from "react";

import { Content } from "#listbox/content.tsx";
import { ItemIndicator } from "#listbox/item-indicator.tsx";
import { ItemText } from "#listbox/item-text.tsx";
import { Item } from "#listbox/item.tsx";
import { Label } from "#listbox/label.tsx";
import { Root, type RootProps } from "#listbox/root.tsx";
import { COLLECTION, ROWS } from "#listbox/rows.fixtures.ts";

/**
 * Draws whatever a case wants measured inside the root that runs the machine.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the root.
 * @returns The root, holding it.
 */
export function offered(
  children: ReactNode,
  props: Omit<RootProps, "collection"> = {},
): ReactElement {
  return (
    <Root collection={COLLECTION} {...props}>
      {children}
    </Root>
  );
}

/**
 * Draws a whole listbox, so a case can walk the rows and read what is chosen.
 *
 * @param props - Whatever the case sets on the root.
 * @returns The parts composed the way a caller composes them.
 */
export function composed(props: Omit<RootProps, "collection"> = {}): ReactElement {
  return (
    <Root collection={COLLECTION} {...props}>
      <Label>Places</Label>
      <Content>
        {ROWS.map((row) => (
          <Item item={row} key={row.value}>
            <ItemText item={row}>{row.label}</ItemText>
            <ItemIndicator item={row}>t</ItemIndicator>
          </Item>
        ))}
      </Content>
    </Root>
  );
}
