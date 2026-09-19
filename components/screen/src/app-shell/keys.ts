/**
 * Answers the keys a panel listens for wherever the reader is.
 *
 * @remarks
 *   Escape closes a panel laid over the page, the way it closes anything else drawn over what a
 *   reader was looking at. A shortcut opens and closes a panel from anywhere with the platform's
 *   modifier held, which is how an application offers ⌘B for its navigation.
 *   Both listen on the document rather than on the panel, because the reader pressing the key is
 *   usually reading the page rather than standing in the panel.
 */

import { useEffect } from "react";

import { useLiveRef } from "@stealthscale/hooks";

/**
 * Describes what a panel tells the listener about itself.
 */
export interface Keyed {
  /**
   * Whether the panel is shown now.
   */
  readonly open: boolean;

  /**
   * Whether the panel is laid over the page, which is when Escape closes it.
   */
  readonly overlaid: boolean;

  /**
   * Shows or hides the panel.
   */
  readonly setOpen: (open: boolean) => void;

  /**
   * The key that opens and closes the panel with the platform's modifier held, or nothing.
   */
  readonly shortcut: string | undefined;
}

/**
 * Reports whether a key press is the platform's modifier held with a key.
 */
function chorded(event: KeyboardEvent, shortcut: string | undefined): boolean {
  return shortcut !== undefined && (event.ctrlKey || event.metaKey) && event.key === shortcut;
}

/**
 * Listens for the keys that open and close one panel.
 *
 * @remarks
 *   The listener is wired once and reads the panel through a ref, so a panel that changes what it
 *   is doing on every keystroke does not tear the listener down and rebuild it.
 * @param panel - The panel's state, and how to open and close it.
 */
export function useKeys(panel: Keyed): void {
  const live = useLiveRef(panel);

  useEffect((): (() => void) => {
    /**
     * Answers one key press.
     *
     * @param event - The key that was pressed.
     */
    function onKeyDown(event: KeyboardEvent): void {
      const { open, overlaid, setOpen, shortcut } = live.current;

      if (overlaid && open && event.key === "Escape") {
        setOpen(false);
      } else if (chorded(event, shortcut)) {
        event.preventDefault();
        setOpen(!open);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return (): void => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [live]);
}
