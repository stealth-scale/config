/**
 * Draws the group itself, which holds the tab stop its items move through.
 *
 * @remarks
 *   The element is `div` and carries no role of its own, because what a set of controls is called
 *   is the caller's: a toolbar states `role="toolbar"`, a set of tabs states `role="tablist"`. The
 *   orientation reaches three places from one prop: the arrows the group moves on, the way the
 *   items are laid out, and what a screen reader is told, which is stated only where the group
 *   carries a role, because the attribute means nothing on a plain element.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { withProvider } from "#roving-focus/context.ts";
import {
  type Orientation,
  RovingFocusContext,
  useRovingFocus,
} from "#roving-focus/use-roving-focus.ts";

/**
 * Draws the element the group is laid out on.
 */
const Shell = withProvider("div", "root");

/**
 * Describes what a group takes beside the variants its recipe offers.
 */
export interface RootProps extends Omit<ComponentProps<typeof Shell>, "orientation"> {
  /**
   * Which item holds the tab stop, where something above decides it.
   */
  activeId?: string | undefined;

  /**
   * The items the group lays out.
   */
  children?: ReactNode | undefined;

  /**
   * Which item Tab first enters, where the group decides for itself.
   */
  defaultActiveId?: string | undefined;

  /**
   * Hears that the tab stop moved.
   */
  onActiveIdChange?: ((activeId: string | undefined) => void) | undefined;

  /**
   * Which arrows move focus, which is along the line unless a caller says otherwise.
   */
  orientation?: Orientation | undefined;

  /**
   * Whether the ends join up.
   */
  wrap?: boolean | undefined;
}

/**
 * Keeps one tab stop for the items inside it, and moves it under the arrow keys.
 */
export function Root(props: RootProps): ReactElement {
  const {
    activeId,
    children,
    defaultActiveId,
    onActiveIdChange,
    orientation = "horizontal",
    wrap = false,
    ...rest
  } = props;
  const { group, onKeyDown } = useRovingFocus({
    activeId,
    defaultActiveId,
    onActiveIdChange,
    orientation,
    wrap,
  });
  const told =
    rest.role !== undefined && orientation !== "both"
      ? { "aria-orientation": orientation }
      : undefined;

  return (
    <RovingFocusContext value={group}>
      <Shell onKeyDown={onKeyDown} orientation={orientation} {...told} {...rest}>
        {children}
      </Shell>
    </RovingFocusContext>
  );
}
