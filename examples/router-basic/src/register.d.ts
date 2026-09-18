/**
 * Registers this application's router, which is where the library reads every path from.
 *
 * @remarks
 *   A declaration file, because the statement is type-only and erases to nothing. It has to import
 *   something to stay a module: `declare module` in a file with no import or export is an ambient
 *   declaration, which replaces the library's own types instead of adding to them.
 */

import { type Routed } from "#routes.ts";

declare module "@tanstack/react-router" {
  /**
   * The router the library resolves a path, a parameter and a search key against.
   */
  interface Register {
    /**
     * The router every typed hook and every `Link` in this application is checked against.
     */
    router: Routed;
  }
}
