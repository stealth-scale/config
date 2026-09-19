/**
 * Draws the slot a strip of tabs sits in inside the navigation.
 *
 * @remarks
 *   The tabs are the disclosure package's, and this restyles one thing about them: their own
 *   hairline is turned off, because the navigation band already draws one and two read as a double
 *   line. Put `Tabs.List` in here with `as`.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Draws the strip at the room the navigation states.
 */
export const Tabs = withContext("div", "tabs");

/**
 * Describes what the tab strip takes.
 */
export type TabsProps = ComponentProps<typeof Tabs>;
