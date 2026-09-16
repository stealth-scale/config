/**
 * Shows the build a running page came from.
 */

import { type ReactElement } from "react";

/**
 * Prints the package name and version the bundle was built from.
 *
 * @remarks
 *   Both values are substituted at build time by the manifest layer, so they are literals in the
 *   output and cost nothing to read. A build without that layer leaves the identifiers undeclared
 *   and fails to compile rather than rendering an empty badge.
 */
export function Badge(): ReactElement {
  return (
    <p>
      {__NAME__} {__VERSION__}
    </p>
  );
}
