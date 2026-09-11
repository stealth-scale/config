/**
 * The attribution an application owes for what it bundled.
 */

import { type Preset, preset } from "#core/layer.ts";

/**
 * Writes out the licence of everything the build bundled.
 *
 * Almost every permissive licence asks for the same thing in return: that its text and its
 * copyright notice travel with the code. A bundle is where that stops happening by itself, because
 * minifying strips the comments the notices were in, so an application that ships one and nothing
 * else is distributing somebody's work without the one condition they attached to it.
 *
 * `.vite/license.md` is the file the builder writes, and it is prose rather than data: the full
 * text of each licence, under the name and version of the dependency it came from. That is what
 * attribution is for and it is why this is not the bill of materials — `build.inventory` answers
 * what is in here for a machine deciding whether to worry, and this answers who to credit for a
 * person deciding whether they may ship it.
 *
 * @returns The preset.
 */
export function licences(): Preset {
  return preset({ config: { build: { license: true } }, name: "build.licences" });
}
