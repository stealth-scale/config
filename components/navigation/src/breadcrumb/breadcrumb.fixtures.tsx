/**
 * Builds the trail a part's specification needs above it, every part needing the root's provider.
 */

import { type ReactElement, type ReactNode } from "react";

import { Root } from "#breadcrumb/root.ts";

/**
 * Draws whatever a case wants measured inside the landmark that provides the variants.
 *
 * @param children - The part under test.
 * @returns The landmark, holding it.
 */
export function trailed(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}
