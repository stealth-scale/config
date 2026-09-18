/**
 * Builds the collapsible a part's specification needs above it, every part reading one machine.
 */

import { type ReactElement, type ReactNode } from "react";

import { fireEvent } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { Content } from "#collapsible/content.tsx";
import { Indicator } from "#collapsible/indicator.tsx";
import { Root, type RootProps } from "#collapsible/root.tsx";
import { Trigger } from "#collapsible/trigger.tsx";

/**
 * Draws whatever a case wants measured inside the root that runs the machine.
 *
 * @param children - The part under test.
 * @returns The root, holding it.
 */
export function disclosed(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Presses a control and waits for the machine to settle.
 *
 * @remarks
 *   A machine schedules its own update, so the state a case reads back has not changed yet unless
 *   the press is flushed. Every case that presses something goes through this.
 * @param control - The control to press.
 * @returns Nothing. The caller reads the screen.
 */
export async function pressed(control: HTMLElement): Promise<void> {
  fireEvent.click(control);
  await settled();
}

/**
 * Draws a whole collapsible, so a case can press the control and read what the block does.
 *
 * @param props - Whatever the case sets on the root.
 * @returns The four parts composed the way a caller composes them.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger>
        Details
        <Indicator>v</Indicator>
      </Trigger>
      <Content>The block</Content>
    </Root>
  );
}
