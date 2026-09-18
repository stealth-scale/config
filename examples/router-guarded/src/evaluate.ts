/**
 * Builds the evaluator the compiler asks before it routes a page.
 */

import { type Evaluate, redirect } from "@stealthscale/provider-router";

import { type Condition, holds, type Session } from "#session.ts";

/**
 * Builds the evaluator every compiled route asks before it is entered.
 *
 * @remarks
 *   Returning false makes the route a 404, because a route nobody may reach does not exist. The one
 *   case that is not a 404 is somebody who has not signed in, who is sent to sign in instead. The
 *   evaluator throws that itself, because it alone knows which condition failed.
 *   The session is read on each call rather than captured here. A person who signs in therefore
 *   changes what is routed without the tree being built again.
 * @param read - Returns who is reading at the moment the condition is asked.
 * @returns The evaluator, for `compileRoutes`.
 * @throws {@link Error} A redirect to the sign-in page, where nobody has signed in.
 */
export function evaluator(read: () => Session): Evaluate<Condition> {
  return (when) => {
    const reading = read();

    if (when.kind === "signedIn" && !reading.signedIn) {
      // The library's own redirect, which is a response rather than an Error subclass.
      // eslint-disable-next-line typescript/only-throw-error -- see above
      throw redirect({ to: "/sign-in" });
    }

    return holds(reading, when);
  };
}
