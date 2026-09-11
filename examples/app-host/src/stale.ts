/**
 * Recovering from a chunk that was there when the page loaded and is not there now.
 */

/**
 * Where the one reload is recorded, so a broken deployment cannot be reloaded at forever.
 */
const RELOADED = "stealth.stale";

/**
 * Describes what to do about a chunk that has gone.
 */
export interface Staleness {
  /**
   * Where to record that this page has already tried once.
   */
  held: Pick<Storage, "getItem" | "setItem">;

  /**
   * How to fetch the page again.
   */
  reload: () => void;
}

/**
 * Fetches the page again, once, when a chunk it was told about has gone.
 *
 * Every chunk is named for its contents, so deploying a new build deletes the names the old one
 * handed out. A page open across a deployment then asks for a file that is not there and the import
 * rejects: a route never arrives, or a loaded application never draws, and nothing on the page says
 * why. That is more likely with a remote than with anything else, because the two are deployed
 * apart and neither waits for the other.
 *
 * Once, and recorded. A deployment that is genuinely missing its files would otherwise have every
 * open page reloading itself for as long as it stayed broken, which turns one bad release into a
 * load test. The second failure is left to throw, which is what puts it in front of somebody.
 *
 * @param stated - Where to record the attempt and how to reload. `Staleness` documents every
 *   member.
 * @returns The listener, so a specification can raise the event without a browser.
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
 * Listens for the bundler saying a chunk has gone.
 *
 * @param stated - Where to record the attempt and how to reload.
 */
export function watching(stated: Staleness): void {
  window.addEventListener("vite:preloadError", stale(stated));
}
