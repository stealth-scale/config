/**
 * A library that runs wherever JavaScript does.
 *
 * @remarks
 *   Nothing here touches a Node global or a browser one, which is the condition
 *   the base preset is for. The package therefore loads in a worker, in an edge
 *   runtime and on a server alike, and adding one `node:` import would end
 *   that.
 * @packageDocumentation
 */

export { added, type Amount } from "#money.ts";
