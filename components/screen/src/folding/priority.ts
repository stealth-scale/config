/**
 * States how far an action survives as the row around it narrows.
 *
 * @remarks
 *   A row of actions cannot keep every control at every width, so each action says how much it
 *   matters and the recipe decides what happens to it. The row measures itself and writes
 *   `data-narrow`, and the action's own recipe reads the pair.
 *   The source this was ported from did it the other way round: an action registered itself into a
 *   menu the row held, from an effect, and the row kept that list in state. React 19 reports state
 *   written from an effect, and the list arrived one render after the row was drawn, so the menu
 *   flickered in. Nothing here writes state and nothing measures an action.
 */

/**
 * Selects how much an action matters, which decides what a narrow row does with it.
 */
export type Priority = "primary" | "secondary" | "tertiary";

/**
 * Lists the priorities from the one that always survives to the one that goes first.
 */
export const PRIORITIES: readonly Priority[] = ["primary", "secondary", "tertiary"];
