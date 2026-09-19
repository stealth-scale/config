/**
 * Builds the checkbox a part's specification needs above it, every part reading one machine.
 */

import { type ReactElement, type ReactNode } from "react";

import { fireEvent } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { Control } from "#checkbox/control.tsx";
import { Indicator } from "#checkbox/indicator.tsx";
import { Label } from "#checkbox/label.tsx";
import { Root, type RootProps } from "#checkbox/root.tsx";

/**
 * Draws whatever a case wants measured inside the root that runs the machine.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the root.
 * @returns The root, holding it.
 */
export function boxed(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
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
 * Draws a whole checkbox, so a case can press it and read what the box does.
 *
 * @param props - Whatever the case sets on the root.
 * @returns The four parts composed the way a caller composes them.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Control>
        <Indicator>t</Indicator>
        <Indicator indeterminate>-</Indicator>
      </Control>
      <Label>Accept the terms</Label>
    </Root>
  );
}
