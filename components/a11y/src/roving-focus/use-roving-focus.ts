/**
 * Moves one tab stop through a set of controls, so a reader reaches the set with Tab and moves
 * inside it with the arrows.
 *
 * @remarks
 *   A toolbar, a row of tabs and a menu bar are all one stop in the tab order, and the arrows move
 *   which control that stop is on. The items register themselves rather than being counted by the
 *   root, because a root cannot see through whatever composes its children. Registration order is
 *   the order the effects ran, which is source order until something is conditional, so the list
 *   is sorted by where the items sit in the document: what the arrows follow is what the reader
 *   sees.
 */

import {
  createContext,
  type KeyboardEvent,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { useCallbackRef, useControllableState } from "@stealthscale/hooks";

/**
 * Selects which arrows move focus through the group.
 */
export type Orientation = "both" | "horizontal" | "vertical";

/**
 * Selects what a key asks for: an edge of the group, or a step through it.
 */
type Intent = "end" | "start" | number | undefined;

/**
 * Maps the arrows that run down the page to the step each takes.
 */
const DOWN_THE_PAGE: Readonly<Record<string, number | undefined>> = { ArrowDown: 1, ArrowUp: -1 };

/**
 * Maps the arrows that run along a line to the step each takes.
 */
const ALONG_THE_LINE: Readonly<Record<string, number | undefined>> = {
  ArrowLeft: -1,
  ArrowRight: 1,
};

/**
 * Describes one item of the group, as the group holds it.
 */
export interface Registration {
  /**
   * The element focus moves to.
   */
  element: HTMLElement;

  /**
   * The id the item answers to.
   */
  id: string;
}

/**
 * Describes what an item reads off the group it is in.
 */
export interface Group {
  /**
   * Which item holds the tab stop, or nothing before the first registers.
   */
  activeId: string | undefined;

  /**
   * Hears that focus reached an item, which moves the stop to it.
   */
  onFocus: (id: string) => void;

  /**
   * Takes an item in, and hands back how to take it out again.
   *
   * @remarks
   *   The teardown is optional because the callback is held in a ref, which reports itself as
   *   callable before the render that fills it. React takes nothing as readily as it takes a
   *   teardown.
   */
  register: (registration: Registration) => (() => void) | undefined;
}

/**
 * Carries the group down to its items.
 */
export const RovingFocusContext = createContext<Group | undefined>(undefined);

/**
 * Orders two items by where they sit in the document.
 */
function byDocumentPosition(first: Registration, second: Registration): number {
  const relation = first.element.compareDocumentPosition(second.element);

  return (relation & Node.DOCUMENT_POSITION_FOLLOWING) === 0 ? 1 : -1;
}

/**
 * Reads what a key asks for, given the arrows the group binds and which way the line runs.
 *
 * @param key - The key pressed.
 * @param orientation - Which arrows the group moves on.
 * @param forward - One where the line runs left to right, minus one where it runs the other way.
 * @returns The step or the edge to move to, or nothing where the group does not claim the key.
 */
function intentOf(key: string, orientation: Orientation, forward: number): Intent {
  if (key === "Home") return "start";
  if (key === "End") return "end";

  const block = DOWN_THE_PAGE[key];

  if (block !== undefined) return orientation === "horizontal" ? undefined : block;

  const inline = ALONG_THE_LINE[key];

  if (inline !== undefined) return orientation === "vertical" ? undefined : inline * forward;

  return undefined;
}

/**
 * Marks out the one item the group moves to, as a slice of the list it is in.
 *
 * @remarks
 *   A slice rather than an index, because the list is read at an index that is always inside it
 *   and a lookup would still be typed as possibly absent. A slice of one is the item, and a slice
 *   of an empty list is empty, so the caller writes no test for a case that cannot arise.
 * @param list - The items, in the order the reader sees them.
 * @param intent - The edge or the step the key asked for.
 * @param from - The item that holds the tab stop.
 * @param wrap - Whether the ends join up.
 * @returns The first and last index of the slice holding the item to move to.
 */
function spanOf(
  list: readonly Registration[],
  intent: Exclude<Intent, undefined>,
  from: string | undefined,
  wrap: boolean,
): readonly [first: number, last: number] {
  const last = list.length - 1;
  const at = list.findIndex((item) => item.id === from);
  const here = at === -1 ? 0 : at;
  const to =
    intent === "start"
      ? 0
      : intent === "end"
        ? last
        : wrap
          ? (here + intent + list.length) % list.length
          : Math.min(last, Math.max(0, here + intent));

  return [to, to + 1];
}

/**
 * Describes what the group keeps: its items, in the order the reader sees them.
 */
interface Registry {
  /**
   * Takes an item in.
   */
  add: (registration: Registration) => void;

  /**
   * Returns true when the node lies inside a registered item, which decides whose key an event is.
   */
  holds: (node: Node) => boolean;

  /**
   * The items in document order, which is what the arrows follow.
   */
  ordered: () => Registration[];

  /**
   * Takes an item out again.
   */
  remove: (id: string) => void;
}

/**
 * Keeps the items in a ref rather than in state.
 *
 * @remarks
 *   Nothing drawn depends on the list, only on which item holds the stop, so putting it in state
 *   would draw the whole group again every time one item mounted, for a change nobody could see.
 */
function useRegistry(): Registry {
  const items = useRef<Registration[]>([]);

  return useMemo(() => {
    /**
     * Takes an item in.
     */
    const add = (registration: Registration): void => {
      items.current = [...items.current, registration];
    };

    /**
     * Returns true when the node lies inside a registered item.
     */
    const holds = (node: Node): boolean =>
      items.current.some((item) => item.element.contains(node));

    /**
     * Returns the items in document order.
     */
    const ordered = (): Registration[] => items.current.toSorted(byDocumentPosition);

    /**
     * Takes an item out again.
     */
    const remove = (id: string): void => {
      items.current = items.current.filter((item) => item.id !== id);
    };

    return { add, holds, ordered, remove };
  }, []);
}

/**
 * Describes what the tab stop holds: which item has it, and how to move it.
 */
interface TabStop {
  /**
   * Which item holds the stop.
   */
  activeId: string | undefined;

  /**
   * Moves the stop to an item.
   */
  claim: (next: string | undefined) => void;

  /**
   * Which item holds the stop, readable inside a callback that was made before the render.
   */
  stop: RefObject<string | undefined>;
}

/**
 * Keeps which item holds the tab stop, driven from above where a caller drives it.
 */
function useTabStop(props: RovingFocusProps): TabStop {
  const { activeId: driven, defaultActiveId, onActiveIdChange } = props;
  const [activeId, setActiveId] = useControllableState<string | undefined>({
    defaultValue: defaultActiveId,
    onChange: onActiveIdChange,
    value: driven,
  });
  const stop = useRef(activeId);

  useEffect(() => {
    stop.current = activeId;
  }, [activeId]);

  const claim = useCallbackRef((next: string | undefined): void => {
    stop.current = next;
    setActiveId(next);
  });

  return { activeId, claim, stop };
}

/**
 * Describes what the hook is given.
 */
export interface RovingFocusProps {
  /**
   * Which item holds the tab stop, where something above decides it.
   */
  activeId?: string | undefined;

  /**
   * Which item Tab first enters, where the group decides for itself.
   */
  defaultActiveId?: string | undefined;

  /**
   * Hears that the tab stop moved.
   */
  onActiveIdChange?: ((activeId: string | undefined) => void) | undefined;

  /**
   * Which arrows move focus.
   */
  orientation: Orientation;

  /**
   * Whether the ends join up.
   */
  wrap: boolean;
}

/**
 * Describes what the hook hands back.
 */
export interface RovingFocus {
  /**
   * The group the items read.
   */
  group: Group;

  /**
   * The handler the root binds, which claims only the keys the group moves on.
   */
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

/**
 * Moves one tab stop through the items that register with it.
 *
 * @remarks
 *   The first item to register takes the stop, so a group is reachable by Tab from its first
 *   render. An item that leaves while it holds the stop hands it to whatever is first, so the
 *   group never drops out of the tab order.
 * @returns The group the items read, and the handler the root binds.
 */
export function useRovingFocus(props: RovingFocusProps): RovingFocus {
  const { orientation, wrap } = props;
  const { add, holds, ordered, remove } = useRegistry();
  const { activeId, claim, stop } = useTabStop(props);

  const register = useCallbackRef((registration: Registration) => {
    add(registration);

    if (stop.current === undefined) claim(registration.id);

    return (): void => {
      remove(registration.id);

      if (stop.current === registration.id) claim(ordered()[0]?.id);
    };
  });

  const onKeyDown = useCallbackRef((event: KeyboardEvent<HTMLElement>): void => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const { target } = event;

    if (!(target instanceof Node) || !holds(target)) return;

    const rightToLeft = globalThis.getComputedStyle(event.currentTarget).direction === "rtl";
    const intent = intentOf(event.key, orientation, rightToLeft ? -1 : 1);

    if (intent === undefined) return;

    for (const moving of ordered().slice(...spanOf(ordered(), intent, stop.current, wrap))) {
      claim(moving.id);
      moving.element.focus();
    }

    event.preventDefault();
  });

  const onFocus = useCallbackRef((id: string): void => {
    claim(id);
  });

  return {
    group: useMemo<Group>(() => ({ activeId, onFocus, register }), [activeId, onFocus, register]),
    onKeyDown,
  };
}
