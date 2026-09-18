/**
 * Builds the popover a part's specification needs above it, every part reading one machine.
 */

import { type ReactElement, type ReactNode } from "react";

import {
  Arrow,
  ArrowTip,
  CloseTrigger,
  Content,
  Description,
  Indicator,
  Positioner,
  Root,
  type RootProps,
  Title,
  Trigger,
} from "#popover/index.ts";

/**
 * Draws whatever a case wants measured inside the root that runs the machine.
 *
 * @param children - The part under test.
 * @returns The root, holding it.
 */
export function opened(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Draws a whole popover, so a case can press the control and read what the panel does.
 *
 * @param props - Whatever the case sets on the root.
 * @returns The parts composed the way a caller composes them.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger>
        Filters
        <Indicator>v</Indicator>
      </Trigger>
      <Positioner>
        <Content>
          <Arrow>
            <ArrowTip />
          </Arrow>
          <Title>Filter the list</Title>
          <Description>Only the rows matching all of these are shown.</Description>
          <CloseTrigger>x</CloseTrigger>
        </Content>
      </Positioner>
    </Root>
  );
}
