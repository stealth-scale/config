/**
 * The headers a preview answers with, which a dev server has no reason to.
 */

import { type Preset, preset } from "@stealthscale/config-core";

/**
 * What a build is served with, so a preview answers the way a deployment will.
 *
 * None of these change what the application does; each one narrows what a browser will let a page
 * do to it. They are here rather than in the dev server because a dev server is reached from one
 * machine by one person, while a preview is the last thing between a build and a deployment — and a
 * header that was going to break something is cheaper to find here.
 *
 * What is deliberately absent is anything that needs a value only a deployment knows: a content
 * security policy names the origins an application actually talks to, and a strict transport header
 * is a promise about a domain. Both belong to whatever serves the build for real.
 */
const ANSWERED = {
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
};

/**
 * Answers every request with the headers a deployment should answer with.
 *
 * @returns The preset.
 */
export function headers(): Preset {
  return preset({ config: { preview: { headers: { ...ANSWERED } } }, name: "preview.headers" });
}
