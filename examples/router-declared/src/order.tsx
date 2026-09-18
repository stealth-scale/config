/**
 * Draws one order, read out of the address by the name its reference carries.
 */

import { type ReactElement } from "react";

import { useRouteParams } from "@stealthscale/provider-router";

import { order } from "#catalogue.ts";

/**
 * Draws the order the address named.
 *
 * @remarks
 *   A route compiled from a declaration is outside the tree this application registered, so the
 *   library types a match's parameters as a union over the routes it did register. The reference
 *   names them instead, and the hook checks that this page really is that route before it reads
 *   them.
 * @returns The order's number, read out of the address.
 */
export function Order(): ReactElement {
  const params = useRouteParams(order);

  return <article>{`Order ${params.order}`}</article>;
}
