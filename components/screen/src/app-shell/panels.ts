/**
 * Keeps what each panel of a shell says about itself, so a control anywhere in the shell reads the
 * panel it points at.
 *
 * @remarks
 *   A trigger in the header and the panel it opens in the body are siblings, so neither can hand
 *   the other anything through a context. The shell holds a store between them: a panel writes what
 *   it is doing, and whoever reads the store is drawn again when that changes.
 *   The store is read through `useSyncExternalStore` rather than kept in state, because a panel
 *   writes to it when it is laid out and state written from an effect is what React 19 reports. The
 *   source this was ported from kept the same list in `useState` and wrote it from a layout effect.
 *   A write that changes nothing tells nobody, so a panel that publishes the same facts on every
 *   render costs its readers nothing.
 */

import { useSyncExternalStore } from "react";

/**
 * Describes what one panel says about itself.
 */
export interface Panel {
  /**
   * The address of the panel's element, which a control that opens it points at.
   */
  readonly id: string;

  /**
   * Whether the panel is shown: open in the body, or laid over the page where it is collapsed.
   */
  readonly open: boolean;

  /**
   * Whether the window is too narrow to hold the panel beside the page and the panel is laid over
   * it instead.
   */
  readonly overlaid: boolean;

  /**
   * Shows or hides the panel, in whichever way it is shown now.
   */
  readonly setOpen: (open: boolean) => void;

  /**
   * Whether the window is too narrow to hold the panel beside the page and the panel has dropped
   * under it as a block instead.
   */
  readonly stacked: boolean;
}

/**
 * Describes the panels of one shell, by the name each was drawn under.
 */
export type Panels = Readonly<Record<string, Panel>>;

/**
 * Describes where a shell keeps its panels.
 */
export interface PanelStore {
  /**
   * Writes what a panel is doing, or takes a panel that has left off the list.
   */
  readonly publish: (name: string, panel?: Panel) => void;

  /**
   * Reads every panel as it stands.
   */
  readonly read: () => Panels;

  /**
   * Tells a reader whenever a panel changes.
   *
   * @returns How to stop.
   */
  readonly subscribe: (onChange: () => void) => () => void;
}

/**
 * Reports whether a panel is doing what it was already doing.
 */
function same(one: Panel | undefined, other: Panel | undefined): boolean {
  if (one === undefined || other === undefined) return one === other;

  return (
    one.id === other.id &&
    one.open === other.open &&
    one.overlaid === other.overlaid &&
    one.setOpen === other.setOpen &&
    one.stacked === other.stacked
  );
}

/**
 * Opens a store for one shell to keep its panels in.
 *
 * @returns The store, empty.
 */
export function panelStore(): PanelStore {
  const listeners = new Set<() => void>();
  let panels: Panels = {};

  return {
    publish: (name, panel): void => {
      if (same(panels[name], panel)) return;

      const { [name]: _gone, ...rest } = panels;

      panels = panel === undefined ? rest : { ...rest, [name]: panel };

      for (const listener of listeners) listener();
    },
    read: (): Panels => panels,
    subscribe: (onChange): (() => void) => {
      listeners.add(onChange);

      return (): void => {
        listeners.delete(onChange);
      };
    },
  };
}

/**
 * Reads every panel of a shell and follows the store, so the reader is drawn again when a panel
 * opens, closes, or changes what it is doing.
 *
 * @param store - The store the shell keeps its panels in.
 * @returns Every panel, by the name each was drawn under.
 */
export function usePanels(store: PanelStore): Panels {
  return useSyncExternalStore(store.subscribe, store.read, store.read);
}
