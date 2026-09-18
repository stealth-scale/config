/**
 * Reads the pages the other deployment declares, or none where it cannot be reached.
 */

import { type RouteDeclaration } from "@stealthscale/provider-router";

/**
 * Reads what the other deployment contributes.
 *
 * @remarks
 *   A deployment that is unreachable contributes nothing rather than stopping this one. Its pages
 *   are missing until it answers again, and everything this application owns still routes. The
 *   failure is reported once here rather than on every navigation.
 * @returns The declarations, or an empty list.
 */
export async function declarations(): Promise<readonly RouteDeclaration[]> {
  try {
    const remote = await import("remote/routes");

    return remote.routes();
  } catch (error: unknown) {
    globalThis.console.warn("The other deployment declared no pages.", error);

    return [];
  }
}
