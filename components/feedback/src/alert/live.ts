/**
 * Maps how loudly an alert is announced onto the role that announces it.
 */

/**
 * Selects how an alert reaches a reader who is not looking at it.
 */
export type Live = "assertive" | "off" | "polite";

/**
 * Lists the three, from the quietest.
 */
export const LIVES: readonly Live[] = ["off", "polite", "assertive"];

/**
 * Maps each to the attributes the root carries.
 *
 * @remarks
 *   `alert` implies `aria-live="assertive"` and `status` implies `aria-live="polite"`, so the role
 *   is the whole of it and a second attribute would only repeat one. An alert that is part of the
 *   page from the first paint takes `off`: a live region announces itself on mount, so a page of
 *   static notices would read every one of them before a reader has asked for anything.
 */
export const ROLES: Readonly<Record<Live, Readonly<Record<string, string>>>> = {
  assertive: { role: "alert" },
  off: {},
  polite: { role: "status" },
};
