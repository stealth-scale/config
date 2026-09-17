/**
 * Reads the version of the React a build resolves.
 */

import { createRequire } from "node:module";

/**
 * Loads the manifest of the React installed beside this package.
 */
function manifest(): unknown {
  return createRequire(import.meta.url)("react/package.json");
}

/**
 * Reads the version of the React a build resolves.
 *
 * @remarks
 *   The version comes from the tree rather than from a constant here, so a major upgrade needs no
 *   edit in this package. React is a peer, so the copy this reads is the consumer's own.
 * @param read - Loads React's manifest. The default reads the copy installed beside this package,
 *   and a test passes its own.
 * @returns The version string the manifest declares.
 * @throws {@link TypeError} When the manifest carries no version string, which is what a missing
 *   peer looks like from here.
 */
export function installed(read: () => unknown = manifest): string {
  const held: unknown = read();
  const version: unknown =
    typeof held === "object" && held !== null ? Reflect.get(held, "version") : undefined;

  if (typeof version !== "string") {
    throw new TypeError(
      "the React version could not be read from React's own manifest. React is a peer of " +
        "@stealthscale/vite-config-react, and both sharing it and compiling against it need the " +
        "one that is installed.",
    );
  }

  return version;
}

/**
 * Reads the major of a version.
 *
 * @param version - The version to read. The installed React where a caller states none.
 * @returns The leading number, as a string.
 */
export function major(version: string = installed()): string {
  return version.replace(/\..*$/u, "");
}
