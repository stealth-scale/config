/**
 * Declares the modules the other deployment exposes, so an import of one type-checks here.
 *
 * @remarks
 *   Nothing in this application builds those modules, and this declaration is all the compiler
 *   knows about them. Where it drifts from what the other deployment actually exposes, the mismatch
 *   surfaces when a visitor opens the page rather than when the build runs.
 */

declare module "remote/routes" {
  import { type RouteDeclaration } from "@stealthscale/provider-router";

  /**
   * Answers the pages the other deployment contributes.
   */
  export function routes(): readonly RouteDeclaration[];
}
