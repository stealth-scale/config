/**
 * Declares the names and shapes a host and a remote both have to spell the same way.
 *
 * @remarks
 *   The two sides are built in separate repositories and meet only at run time.
 *   A disagreement about the entry filename or a shared version range surfaces
 *   as a failed fetch, long after both builds succeeded.
 */

/**
 * Maps each specifier a host imports to the module inside the remote that answers it.
 *
 * @remarks
 *   A key is written as the remote's own root sees it, so `./Dashboard` reaches
 *   a host as `shop/Dashboard`. A value is a path relative to that root and is
 *   never resolved by the host.
 */
export type Exposed = Readonly<Record<string, string>>;

/**
 * Lists each remote a host imports from by name, and nothing about where it is served.
 *
 * @remarks
 *   The address is supplied at run time by whatever registers the remote, so one
 *   built artefact runs against staging and production alike.
 */
export type Remotes = readonly string[];

/**
 * Stands in for a remote's address until a deployment registers the real one.
 *
 * @remarks
 *   The `.invalid` top-level domain is reserved and resolves nowhere. A host
 *   that reaches the network for this address has skipped registration, and it
 *   fails on the fetch rather than quietly loading something else.
 */
export const UNSET = "https://federation.invalid";

/**
 * The terms a host and a remote agree on for one shared dependency.
 *
 * @remarks
 *   Each side declares the dependency independently. Whichever copy loads first
 *   takes the shared slot, so two sides that disagree about a range run
 *   whichever build happened to arrive first.
 */
export interface Sharing {
  /**
   * Restricts the shared slot to a range, so a copy outside it loads on its own.
   */
  requiredVersion?: string;

  /**
   * Collapses the host and every remote it loads onto one instance of the dependency.
   */
  singleton?: boolean;
}

/**
 * Lists every shared dependency under the specifier an import writes.
 *
 * @remarks
 *   A key matches by specifier and not by package, so an entry naming a package
 *   leaves a deep import into that package unshared.
 */
export type Shared = Readonly<Record<string, Sharing>>;

/**
 * Points a host at the manifest listing what a remote exposes.
 *
 * @remarks
 *   The name carries no content hash. A host resolves it by URL at run time, and
 *   a hashed name would pin the host to one particular build of the remote.
 */
export const ENTRY = "remoteEntry.js";
