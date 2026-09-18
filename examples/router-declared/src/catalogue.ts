/**
 * Stands in for the routes this application draws but did not write.
 *
 * @remarks
 *   A real application fetches this at boot, from a document, a configuration service or a module
 *   another deployment exposes. It is a module here so the example runs with nothing behind it, and
 *   the shape is what matters: data, with each page behind an importer.
 */

import { type RouteDeclaration, type RouteRef } from "@stealthscale/provider-router";

/**
 * The language a condition is written in here, which states nothing.
 */
export type Condition = never;

/**
 * The parameters the order page's path names.
 *
 * @remarks
 *   An alias rather than an interface. TypeScript gives an interface no implicit index signature,
 *   so an interface does not satisfy the shape a reference's parameters are constrained to.
 */
export type OrderParams = Readonly<Record<"order", string>>;

/**
 * Points at the page listing every order.
 *
 * @remarks
 *   A reference rather than a bare string, so a link to it is checked and its parameters are named.
 */
export const orders: RouteRef = { id: "sales.orders" };

/**
 * Points at the page drawing one order, which its path names by number.
 *
 * @remarks
 *   It states no layout. Nesting under the orders page already puts it inside that page's frames,
 *   and naming them again would draw each one twice.
 */
export const order: RouteRef<OrderParams> = { id: "sales.order" };

/**
 * Points at the page a person reads the shipping settings on.
 */
export const shipping: RouteRef = { id: "sales.shipping" };

/**
 * Answers the routes this application draws but did not write.
 *
 * @remarks
 *   Asynchronous because the real thing is fetched. Every page is stated as an importer and the
 *   export it is published under, so the bundle holding it is loaded on the first navigation to it
 *   rather than at boot.
 * @returns One declaration per page.
 */
export function catalogue(): Promise<ReadonlyArray<RouteDeclaration<Condition>>> {
  return Promise.resolve([
    {
      component: { export: "Orders", load: () => import("#orders.tsx") },
      id: orders.id,
      layout: ["sales"],
      navigation: { label: "Orders", order: 1 },
      path: "/orders",
    },
    {
      component: { export: "Order", load: () => import("#order.tsx") },
      id: order.id,
      parent: orders.id,
      path: "$order",
    },
    {
      component: { export: "Shipping", load: () => import("#shipping.tsx") },
      id: shipping.id,
      layout: ["sales"],
      navigation: { label: "Shipping", order: 2 },
      path: "/shipping",
    },
  ]);
}
