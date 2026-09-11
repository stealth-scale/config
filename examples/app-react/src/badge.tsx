/**
 * What the app shows about itself.
 */

import { type ReactElement } from "react";

/**
 * Names the build it is running in.
 *
 * @returns The element.
 */
export function Badge(): ReactElement {
  return (
    <p>
      {__NAME__} {__VERSION__}
    </p>
  );
}
