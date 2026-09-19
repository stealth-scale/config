/**
 * Builds the switcher a part's specification needs above it.
 */

import { type ReactElement, type ReactNode } from "react";

import { Menu } from "@stealthscale/component-disclosure";

import { Check } from "#switcher/check.ts";
import { Content } from "#switcher/content.ts";
import { Detail } from "#switcher/detail.ts";
import { Label } from "#switcher/label.ts";
import { Name } from "#switcher/name.ts";
import { Option } from "#switcher/option.ts";
import { Root, type RootProps } from "#switcher/root.ts";
import { Trigger } from "#switcher/trigger.tsx";

/**
 * Draws whatever a case wants measured inside the switcher that hands down the variants.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the switcher.
 * @returns The switcher, holding it.
 */
export function switched(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Draws the control alone, with the list closed.
 *
 * @remarks
 *   A case that reads the control rather than the list takes this, because an open menu measures
 *   where to place itself after the render returns and a synchronous case would read the control
 *   before that settled. React reports the state the machine writes then as an update outside
 *   `act`.
 * @param props - Whatever the case sets on the switcher.
 * @returns The switcher, holding the control and no list.
 */
export function triggered(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger label="Workspace">
        <Label>
          <Name>Acme</Name>
          <Detail>Pro plan</Detail>
        </Label>
      </Trigger>
    </Root>
  );
}

/**
 * Draws whatever rows a case wants measured inside an open panel.
 *
 * @param children - The rows under test.
 * @param props - Whatever the case sets on the switcher.
 * @returns The switcher, open, holding them.
 */
export function opened(children: ReactNode, props: RootProps = {}): ReactElement {
  return (
    <Root open {...props}>
      <Trigger label="Workspace">Acme</Trigger>
      <Menu.Positioner>
        <Content>{children}</Content>
      </Menu.Positioner>
    </Root>
  );
}

/**
 * Draws a whole switcher, so a case can read what the control says and what the panel holds.
 *
 * @param props - Whatever the case sets on the switcher.
 * @returns The parts composed the way a caller composes them.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root open {...props}>
      <Trigger label="Workspace">
        <Label>
          <Name>Acme</Name>
          <Detail>Pro plan</Detail>
        </Label>
      </Trigger>
      <Menu.Positioner>
        <Content>
          <Option checked type="radio" value="acme">
            <Menu.ItemText>Acme</Menu.ItemText>
            <Check />
          </Option>
          <Option checked={false} type="radio" value="globex">
            <Menu.ItemText>Globex</Menu.ItemText>
            <Check />
          </Option>
        </Content>
      </Menu.Positioner>
    </Root>
  );
}
