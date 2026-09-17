/**
 * Re-exports TanStack's hotkeys under this design system's own name.
 *
 * @remarks
 *   A wildcard rather than a written list. The module declares nothing of its own, so there is no
 *   local binding a wildcard could publish over, and the library states more than sixty names and
 *   is still below its first major. A written list would drift on the release that adds one.
 *   The library's own defaults are this design system's too. They stop the browser's own action,
 *   stop the event propagating, and stay out of the way of a focused input. Nothing is added here,
 *   so a shortcut behaves the way the library documents it.
 */

export * from "@tanstack/react-hotkeys";
