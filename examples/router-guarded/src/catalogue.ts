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
