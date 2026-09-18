/**
 * Reads the pages the other deployment declares, or none where it cannot be reached.
 */

import { type RouteDeclaration } from "@stealthscale/provider-router";

/**
 * Reads the text a menu draws a declaration under.
 *
 * @remarks
 *   The compiler writes `navigation` onto the route without reading it, so its shape is an
 *   agreement between the two deployments rather than something the foundation states. This one
 *   reads a `label`, and a declaration carrying anything else is drawn under its id.
 * @param declaration - The declaration a menu is drawing.
 * @returns The text for the link.
 */
export function labelOf(declaration: RouteDeclaration): string {
  const entry: unknown = declaration.navigation;
  const label: unknown =
    typeof entry === "object" && entry !== null ? Reflect.get(entry, "label") : undefined;

  return typeof label === "string" ? label : declaration.id;
}

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
