/**
 * The `federation` block: applications that are deployed apart and joined in a browser.
 *
 * Nothing here names a framework. A host written in one and a remote written in another load each
 * other, which is most of the reason to reach for this at all, so what a framework needs shared is
 * that framework's package to say — `react.shared` for anything that renders.
 *
 * Read from the application's own config. Which modules an application hands over and where it
 * fetches others from is the one thing no configuration package can work out.
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
