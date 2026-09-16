/**
 * The `preview` block: where a build is reached once it has been made.
 *
 * The dev server and this one take the same settings and answer different things. One serves the
 * source as it is edited, the other serves what was built. A repository wanting both stated at once
 * says each in its own block, because an application is usually previewed at a different port from
 * the one it is developed at, and often by a different audience.
 *
 * Every setting not stated here falls back to the dev server's, which is why `server.port` says a
 * preview keeps its own port but inherits its strictness.
 */

export { address } from "#preview/address.ts";
export { bound } from "#preview/bound.ts";
export { headers } from "#preview/headers.ts";
export { port } from "#preview/port.ts";
export { reachable } from "#preview/reachable.ts";
export { shared } from "#preview/shared.ts";
