/**
 * Draws the two sections that show the published component packages, typography and actions, one
 * below the other.
 *
 * @remarks
 *   The page composes eight scenes and reaches the house cap on a file's dependencies, so the two
 *   package sections reach it through this one.
 */

import { type ReactElement } from "react";

import { Actions } from "#actions.tsx";
import { Typography } from "#typography.tsx";

/**
 * Draws the typography section and the actions section.
 */
export function Published(): ReactElement {
  return (
    <>
      <Typography />
      <Actions />
    </>
  );
}
