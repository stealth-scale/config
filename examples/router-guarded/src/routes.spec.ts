import { describe, expect, it } from "vitest";

import { isNotFound, isRedirect } from "@stealthscale/provider-router";

import { audit, mine, summary } from "#catalogue.ts";
import { routed } from "#routes.ts";
import { ANONYMOUS, type Session, signedInAs } from "#session.ts";

/**
 * Somebody who has signed in and may read nothing in particular.
 */
const SIGNED_IN: Session = { permissions: [], signedIn: true };

/**
 * Somebody who has signed in and may read the audit.
 */
const AUDITOR: Session = { permissions: ["audit"], signedIn: true };

/**
 * Opens a page for one session and reports what the router made of it.
 *
 * @param reading - Who is reading.
 * @param at - The address to open.
 * @returns Where the router ended up, and whatever any match refused with.
 */
async function opened(
  reading: Session,
  at: string,
): Promise<{ readonly errors: unknown[]; readonly pathname: string }> {
  signedInAs(reading);

  const router = routed();

  await router.navigate({ to: at });
  await router.load();

  return {
    errors: router.state.matches.map((match) => match.error).filter((error) => error !== undefined),
    pathname: router.state.location.pathname,
  };
}

describe("routed", () => {
  it("compiles every page whoever is reading", () => {
    const built = Object.keys(routed().routesById);

    for (const id of [summary.id, mine.id, audit.id]) {
      expect(built.some((one) => one.endsWith(id.split(".")[1] ?? ""))).toBe(true);
    }
  });

  it("sends the site root to the page anybody may read", async () => {
    const { pathname } = await opened(ANONYMOUS, "/");

    expect(pathname).toBe("/summary");
  });

  it("routes a page that asks nothing", async () => {
    const { errors, pathname } = await opened(ANONYMOUS, "/summary");

    expect(pathname).toBe("/summary");
    expect(errors).toStrictEqual([]);
  });

  it("sends somebody who has not signed in to sign in", async () => {
    const { pathname } = await opened(ANONYMOUS, "/mine");

    expect(pathname).toBe("/sign-in");
  });

  it("routes that page once they have signed in", async () => {
    const { errors, pathname } = await opened(SIGNED_IN, "/mine");

    expect(pathname).toBe("/mine");
    expect(errors).toStrictEqual([]);
  });

  it("refuses a page a person may not reach as not-found", async () => {
    const { errors } = await opened(SIGNED_IN, "/audit");

    expect(errors.some((error) => isNotFound(error))).toBe(true);
  });

  it("refuses it as not-found rather than a redirect", async () => {
    const { errors } = await opened(SIGNED_IN, "/audit");

    expect(errors.some((error) => isRedirect(error))).toBe(false);
  });

  it("routes that page for somebody holding the permission", async () => {
    const { errors, pathname } = await opened(AUDITOR, "/audit");

    expect(pathname).toBe("/audit");
    expect(errors).toStrictEqual([]);
  });
});
