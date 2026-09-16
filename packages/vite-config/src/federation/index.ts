/**
 * Gathers the layers that configure either side of a module federation boundary.
 */

export { host, type Hosted } from "#federation/host.ts";
export { remote, type Remoted } from "#federation/remote.ts";
export {
  ENTRY,
  type Exposed,
  type Remotes,
  type Shared,
  type Sharing,
} from "#federation/settings.ts";
