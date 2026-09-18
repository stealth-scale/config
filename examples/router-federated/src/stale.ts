/**
 * Recovers a page whose chunks the other deployment has already replaced.
 *
 * @remarks
 *   That deployment ships on its own schedule, so a chunk a route was told about at page load can
 *   be gone by the time a visitor navigates there. Vite reports the failed fetch as a
 *   `vite:preloadError` event, and a fresh page load picks up the manifest naming the chunks that
 *   exist now.
 */

/**
 * The key marking that this page has already been fetched a second time.
 */
const RELOADED = "stealth.stale";

/**
 * Gives a reload the store its mark survives in and the call that fetches the page again.
 */
export interface Staleness {
  /**
   * Where the mark outlives the reload. A session store scopes it to the one tab.
   */
  held: Pick<Storage, "getItem" | "setItem">;

  /**
   * Fetches the page again.
   */
  reload: () => void;
}

/**
 * Builds the listener that fetches the page again when a chunk has gone.
 *
 * @remarks
 *   A page reloads at most once per session. Leaving the second failure to propagate means a
 *   visitor sees the bundler's error, where reloading on every failure would spin against a
 *   deployment that is broken rather than merely newer.
 * @returns A listener that cancels the first failure it is given and lets every later one through.
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
 * Subscribes the reload listener to the bundler's preload failures.
 *
 * @remarks
 *   The listener stays on the window for as long as the page lives, and the page it belongs to is
 *   the one being replaced, so nothing removes it.
 */
export function watching(stated: Staleness): void {
  window.addEventListener("vite:preloadError", stale(stated));
}
