/**
 * Builds the tooltip a part's specification needs above it, every part reading one machine.
 */

import { type ReactElement, type ReactNode } from "react";

import { ArrowTip } from "#tooltip/arrow-tip.tsx";
import { Arrow } from "#tooltip/arrow.tsx";
import { Content } from "#tooltip/content.tsx";
import { Positioner } from "#tooltip/positioner.tsx";
import { Root, type RootProps } from "#tooltip/root.tsx";
import { Trigger } from "#tooltip/trigger.tsx";

/**
 * Draws whatever a case wants measured inside the root that runs the machine.
 *
 * @param children - The part under test.
 * @returns The root, holding it.
 */
export function hinted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Draws a whole tooltip, so a case can rest on the control and read what the box does.
 *
 * @param props - Whatever the case sets on the root.
 * @returns The six parts composed the way a caller composes them.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger>Save</Trigger>
      <Positioner>
        <Content>
          <Arrow>
            <ArrowTip />
          </Arrow>
          Saves without closing
        </Content>
      </Positioner>
    </Root>
  );
}
