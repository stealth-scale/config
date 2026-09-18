/**
 * Draws the menu and the session controls this application puts around every page.
 */

import { type ReactElement, useSyncExternalStore } from "react";

import { Outlet, RouteLink, useRouter } from "@stealthscale/provider-router";

import { catalogue, labelOf } from "#catalogue.ts";
import { ANONYMOUS, type Session, session, signedInAs, watchSession } from "#session.ts";

/**
 * One reader a person switches to, under the name the control offers it by.
 */
interface Reader {
  /**
   * The text the control reads.
   */
  readonly label: string;

  /**
   * The session every condition is asked about once it is chosen.
   */
  readonly session: Session;
}

/**
 * The readers this example switches between, which stand in for signing in and out.
 */
const READERS: readonly Reader[] = [
  { label: "Anonymous", session: ANONYMOUS },
  { label: "Signed in", session: { permissions: [], signedIn: true } },
  { label: "Auditor", session: { permissions: ["audit"], signedIn: true } },
];

/**
 * Draws the menu, the session controls and whichever page the address named.
 *
 * @remarks
 *   The menu lists every page, including the ones the reader would be refused. Which entries a
 *   person should be offered is a question about this application rather than about routing, and
 *   listing them all is what makes a refusal visible.
 *   Choosing a reader invalidates the router rather than building a new one. The evaluator asks the
 *   session on every navigation, so the page being drawn is checked again against whoever is now
 *   reading and the tree stays as it was.
 * @returns The frame, holding the page.
 */
export function Shell(): ReactElement {
  const router = useRouter();
  const reading = useSyncExternalStore(watchSession, session);

  return (
    <>
      <nav aria-label="Pages">
        {catalogue().map((declaration) => (
          <RouteLink key={declaration.id} to={declaration.id}>
            {labelOf(declaration)}
          </RouteLink>
        ))}
      </nav>
      <fieldset>
        <legend>{"Reading as"}</legend>
        {READERS.map((reader) => (
          <button
            aria-pressed={reader.session === reading}
            key={reader.label}
            onClick={() => {
              signedInAs(reader.session);
              void router.invalidate();
            }}
            type="button"
          >
            {reader.label}
          </button>
        ))}
      </fieldset>
      <Outlet />
    </>
  );
}
