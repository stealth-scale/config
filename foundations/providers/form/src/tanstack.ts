/**
 * Re-exports TanStack Form under this design system's own name.
 *
 * @remarks
 *   A wildcard rather than a written list. The module declares nothing of its own, so there is no
 *   local binding a wildcard could publish over, and a written list would drift on the release that
 *   adds a name.
 *   The library is a peer rather than a dependency. A bound field reads its form through React
 *   context, so two copies on one page leave a field reading a form that never rendered it.
 */

export * from "@tanstack/react-form";
