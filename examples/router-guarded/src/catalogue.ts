/**
 * States the pages this application draws, and what each one asks before it is routed.
 */

import { type RouteDeclaration, type RouteRef } from "@stealthscale/provider-router";

import { type Condition } from "#session.ts";

/**
 * Points at the page anyone may read.
 */
export const summary: RouteRef = { id: "reports.summary" };

/**
 * Points at the page only somebody signed in may read.
 */
export const mine: RouteRef = { id: "reports.mine" };

/**
 * Points at the page only somebody holding the audit permission may read.
 */
export const audit: RouteRef = { id: "reports.audit" };

/**
 * Reads the text a menu draws a declaration under.
 *
 * @remarks
 *   The compiler writes `navigation` onto the route without reading it, so its shape is this
 *   application's to decide and this application's to check. This one states plain text, and a
 *   declaration carrying anything else is drawn under its id.
 * @param declaration - The declaration a menu is drawing.
 * @returns The text for the link.
 */
export function labelOf(declaration: RouteDeclaration<Condition>): string {
  return typeof declaration.navigation === "string" ? declaration.navigation : declaration.id;
}

/**
 * Returns the pages this application draws.
 *
 * @returns One declaration per page.
 */
export function catalogue(): ReadonlyArray<RouteDeclaration<Condition>> {
  return [
    {
      component: { export: "Page", load: () => import("#page.tsx") },
      id: summary.id,
      navigation: "Summary",
      path: "/summary",
    },
    {
      component: { export: "Page", load: () => import("#page.tsx") },
      id: mine.id,
      navigation: "Mine",
      path: "/mine",
      when: { kind: "signedIn" },
    },
    {
      component: { export: "Page", load: () => import("#page.tsx") },
      id: audit.id,
      navigation: "Audit",
      path: "/audit",
      when: { kind: "permission", permission: "audit" },
    },
  ];
}
