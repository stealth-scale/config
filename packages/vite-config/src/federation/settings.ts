/**
 * What one application tells another about itself.
 */

/**
 * Each name a consumer imports, against the module behind it.
 *
 * The name is what an importing application writes after the remote's own name, so `./Dashboard` is
 * imported as `remote/Dashboard`. The module is a path in this package.
 */
export type Exposed = Readonly<Record<string, string>>;

/**
 * The name each remote is imported under.
 *
 * Names and no URLs. What the bundler needs is the name, because `remote/Thing` is resolved while
 * the application is built; where that remote is deployed is not something a build can know, and
 * writing it down is what produces one artefact per environment.
 */
export type Remotes = readonly string[];

/**
 * What a remote's entry is set to until something says where it really is.
 *
 * `.invalid` never resolves, by the standard that reserves it. A host that forgets to register its
 * remotes therefore fails with a name server error naming this host, which says what went wrong; a
 * plausible-looking default would instead fetch something real and fail later and further away.
 */
export const UNSET = "https://federation.invalid";

/**
 * What one dependency is shared as.
 */
export interface Sharing {
  /**
   * Which versions satisfy this share. A host offering something outside it is not used.
   */
  requiredVersion?: string;

  /**
   * Whether every application gets the same instance rather than one each.
   */
  singleton?: boolean;
}

/**
 * Each dependency both sides load, against how it is shared.
 */
export type Shared = Readonly<Record<string, Sharing>>;

/**
 * What the entry is called, so a host has one URL to write down.
 *
 * The plugin hashes everything else it emits, which is what lets the rest be cached forever. The
 * entry is the one file whose name a second application has to know before it has loaded anything,
 * so it is the one file that cannot be hashed.
 */
export const ENTRY = "remoteEntry.js";
