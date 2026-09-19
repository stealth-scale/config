/**
 * Draws the control that opens and closes a panel.
 *
 * @remarks
 *   It points at the panel by name, so a burger in the bar across the top opens the navigation in
 *   the body without either part having been handed the other. It states which panel it controls
 *   and whether that panel is shown, so a mark inside it can turn with the panel and a screen
 *   reader says what pressing it does. A panel that has dropped under the page is always shown and
 *   there is nothing to open, so the control leaves the document rather than standing there doing
 *   nothing. Name it for the panel rather than for itself. `Navigation` beside `aria-expanded`
 *   reads as "Navigation, collapsed, button", which says both what it opens and what state it is
 *   in.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#app-shell/context.ts";
import { useAppShellPanel } from "#app-shell/state.ts";

/**
 * Draws the control at the room the shell states.
 */
const Pressable = withContext("button", "trigger", { defaultProps: { type: "button" } });

/**
 * Describes what the control takes.
 */
export interface TriggerProps extends Omit<ComponentProps<typeof Pressable>, "aria-controls"> {
  /**
   * The name the panel it opens was drawn under. Default: `navbar`.
   */
  readonly panel?: string | undefined;
}

/**
 * Draws the control that opens and closes one panel.
 *
 * @param props - Which panel, and everything a styled button takes.
 * @returns The control, or nothing where the panel it points at has dropped under the page.
 */
export function Trigger({ onClick, panel = "navbar", ...rest }: TriggerProps): null | ReactElement {
  const held = useAppShellPanel(panel);

  if (held?.stacked === true) return null;

  return (
    <Pressable
      aria-controls={held?.id}
      aria-expanded={held?.open ?? false}
      data-state={held?.open === true ? "open" : "closed"}
      {...rest}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) held?.setOpen(!held.open);
      }}
    />
  );
}
