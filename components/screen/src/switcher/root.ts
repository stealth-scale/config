/**
 * Holds the switcher together and sets the variants every part reads.
 *
 * @remarks
 *   It is the disclosure package's menu, drawing no element of its own, so the roles, the keyboard,
 *   the escape and the placing come from that component.
 *   It takes the variants rather than the control does, because the panel is placed outside the
 *   control in the document and a control that held them would leave every row in the panel with
 *   nothing to read.
 */

import { type ComponentProps } from "react";

import { Menu } from "@stealthscale/component-disclosure";

import { withRootProvider } from "#switcher/context.ts";

/**
 * Wraps the menu and hands the variants down to every part.
 */
export const Root = withRootProvider(Menu.Root);

/**
 * Describes what the switcher takes.
 */
export type RootProps = ComponentProps<typeof Root>;
