/**
 * Recovers from a chunk that existed when the page loaded and has since been deployed away.
 *
 * @remarks
 *   Chunks are named for their contents, so a deployment deletes the names the previous build
 *   handed out. A page left open across one asks for a file that is gone: a route never arrives or
 *   a loaded application never draws, with nothing on the page to say why. A host meets this more
 *   often than a single-bundle application, because it and its remotes are deployed apart.
 */

/**
 * Keys the record of the one reload this page is allowed.
 */
const RELOADED = "stealth.stale";

/**
 * Supplies what recovery needs from the page it is running in.
 */
export interface Staleness {
  /**
   * Where the attempt is recorded, surviving a reload but not a new tab.
   */
  held: Pick<Storage, "getItem" | "setItem">;

  /**
   * Fetches the page again.
   */
  reload: () => void;
}

/**
 * Builds a listener that reloads the page on the first missing chunk and stands aside on the next.
 *
 * @remarks
 *   A deployment that really is missing its files would otherwise have every open page reloading
 *   for as long as it stayed broken, turning one bad release into a load test. The second failure
 *   is left to propagate, which is what puts it in front of somebody.
 * @returns A listener that swallows the first failure and lets any later one through.
 */
export function stale(stated: Staleness): (event: Event) => void {
  return (event) => {
    if (stated.held.getItem(RELOADED) !== null) return;

    event.preventDefault();
    stated.held.setItem(RELOADED, "1");
    stated.reload();
  };
}

/**
 * Subscribes to the bundler's report that a preloaded chunk could not be fetched.
 *
 * @remarks
 *   The subscription lasts as long as the page and cannot be withdrawn. A caller that wants the
 *   listener on its own terms takes one from {@link stale} and registers it itself.
 */
export function watching(stated: Staleness): void {
  window.addEventListener("vite:preloadError", stale(stated));
}
