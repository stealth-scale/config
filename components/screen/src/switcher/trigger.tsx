/**
 * Draws the control naming what a screen is showing, which opens the list of what else it could
 * show.
 *
 * @remarks
 *   What is switched is drawn as words out of sight at the start of the control, so a reader hears
 *   `Workspace Acme` rather than `Acme` and is told what pressing it changes. It is content rather
 *   than an `aria-label`, because a label would replace the name a reader can see and a control
 *   whose spoken name is not its visible one is one a speech user cannot ask for.
 *   Nothing here draws artwork. The mark beside the current thing is the caller's, and a switcher
 *   without one is a name over a detail, which is the common case.
 */

import { type ComponentProps, type ReactElement } from "react";

import { VisuallyHidden } from "@stealthscale/component-a11y";
import { Menu } from "@stealthscale/component-disclosure";

import { withContext } from "#switcher/context.ts";

/**
 * Draws the control at the size the switcher states.
 */
const Pressed = withContext(Menu.Trigger, "root");

/**
 * Describes what the control takes.
 */
export interface TriggerProps extends ComponentProps<typeof Pressed> {
  /**
   * The kind of thing being switched: `Workspace`, `Project`, `Environment`. A screen reader hears
   * it before the current thing's name.
   */
  readonly label: string;
}

/**
 * Labels what is showing, and opens what else could show.
 *
 * @param props - The kind of thing switched, and everything a trigger takes.
 * @returns The control, named by what it switches and by what it is switched to.
 */
export function Trigger({ children, label, ...rest }: TriggerProps): ReactElement {
  return (
    <Pressed {...rest}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Pressed>
  );
}
