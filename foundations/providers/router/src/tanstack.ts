/**
 * Re-exports TanStack Router under this design system's own name.
 *
 * @remarks
 *   A wildcard rather than a written list. The module declares nothing of its own, so there is no
 *   local binding a wildcard could publish over, and the library states more than a hundred names.
 *   A written list would drift on the release that adds one.
 *   The library is a peer rather than a dependency. A router keeps its matches in React context, so
 *   two copies on one page leave a component reading the router that did not render it, the same
 *   way two copies of React leave a hook reading the wrong dispatcher.
 */

export * from "@tanstack/react-router";
