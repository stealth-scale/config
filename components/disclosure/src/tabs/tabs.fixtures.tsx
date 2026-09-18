/**
 * Builds the set of tabs a part's specification needs above it, every part reading one machine.
 */

import { type ReactElement, type ReactNode } from "react";

import { Content } from "#tabs/content.tsx";
import { Indicator } from "#tabs/indicator.tsx";
import { List } from "#tabs/list.tsx";
import { Root, type RootProps } from "#tabs/root.tsx";
import { Trigger } from "#tabs/trigger.tsx";

/**
 * Draws whatever a case wants measured inside the root that runs the machine.
 *
 * @param children - The part under test.
 * @returns The root, holding it.
 */
export function tabbed(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Draws a whole set of three, so a case can choose one and read what the panels do.
 *
 * @param props - Whatever the case sets on the root.
 * @returns The five parts composed the way a caller composes them.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root defaultValue="first" {...props}>
      <List>
        <Trigger value="first">First</Trigger>
        <Trigger value="second">Second</Trigger>
        <Trigger disabled value="third">
          Third
        </Trigger>
        <Indicator />
      </List>
      <Content value="first">The first panel</Content>
      <Content value="second">The second panel</Content>
      <Content value="third">The third panel</Content>
    </Root>
  );
}
