/**
 * Builds the command palette a part's specification needs above it.
 */

import { type ReactElement, type ReactNode } from "react";

import { fireEvent } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { ACTIONS } from "#command/actions.fixtures.ts";
import { Empty } from "#command/empty.ts";
import { Input } from "#command/input.tsx";
import { List } from "#command/list.tsx";
import { Root, type RootProps } from "#command/root.tsx";

/**
 * Draws whatever a case wants measured inside the panel that holds the palette.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the panel.
 * @returns The panel, holding it.
 */
export function palette(
  children: ReactNode,
  props: Omit<RootProps, "actions" | "aria-label"> = {},
): ReactElement {
  return (
    <Root actions={ACTIONS} aria-label="Commands" {...props}>
      {children}
    </Root>
  );
}

/**
 * Types into a palette's field and waits for the list to settle.
 *
 * @param field - The field to type into.
 * @param text - What to type.
 * @returns Nothing. The caller reads the screen.
 */
export async function typed(field: HTMLElement, text: string): Promise<void> {
  fireEvent.change(field, { target: { value: text } });
  await settled();
}

/**
 * Draws a whole palette, so a case can type into it and read what is left.
 *
 * @param props - Whatever the case sets on the panel.
 * @returns The parts composed the way a caller composes them.
 */
export function composed(props: Omit<RootProps, "actions" | "aria-label"> = {}): ReactElement {
  return (
    <Root actions={ACTIONS} aria-label="Commands" {...props}>
      <Input aria-label="Type a command" />
      <List>
        <Empty>No commands match</Empty>
      </List>
    </Root>
  );
}
