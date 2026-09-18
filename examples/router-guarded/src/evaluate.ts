/**
 * Builds the evaluator the compiler asks before it routes a page.
 */

import { type Evaluate, redirect } from "@stealthscale/provider-router";

import { type Condition, holds, type Session } from "#session.ts";

/**
 * Builds the evaluator for one session.
 *
 * @remarks
 *   Returning false makes the route a 404, because a route nobody may reach does not exist. The one
 *   case that is not a 404 is somebody who has not signed in, who is sent to sign in instead. The
 *   evaluator throws that itself, because it alone knows which condition failed.
 * @param session - Who is reading.
 * @returns The evaluator, for `compileRoutes`.
 * @throws {@link Error} A redirect to the sign-in page, where nobody has signed in.
 */
export function evaluator(session: Session): Evaluate<Condition> {
  return (when) => {
    if (when.kind === "signedIn" && !session.signedIn) {
      // The library's own redirect, which is a response rather than an Error subclass.
      // eslint-disable-next-line typescript/only-throw-error -- see above
      throw redirect({ to: "/sign-in" });
    }

    return holds(session, when);
  };
}
