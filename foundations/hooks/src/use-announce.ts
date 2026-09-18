/**
 * Announces to a screen reader a change the page shows without words.
 *
 * @remarks
 *   Written for changes with no visual element of their own, such as "5 results", "copied" or "row
 *   removed". The change is plain on screen and silent to anything reading the page aloud. The live
 *   region the behaviour library ships uses one element name for every politeness, and removes
 *   whichever region it finds before announcing, so a polite message takes an assertive one off the
 *   page. It also sets no `aria-atomic`, which lets "3 results" after "13 results" be read as "3".
 *   A second caller in the same tick removes the first caller's region before its timer runs, which
 *   is the ordinary case here rather than an unusual one.
 */

import { useCallback, useRef } from "react";

/**
 * How much a message is allowed to interrupt.
 */
export type AnnouncePoliteness = "assertive" | "polite";

/**
 * One region per politeness, shared by every caller.
 *
 * @remarks
 *   A hook that mounted a region per component would leave a page holding a dozen of them, and a
 *   screen reader would read whichever one it found.
 */
const regions = new Map<AnnouncePoliteness, HTMLElement>();

/**
 * The messages queued for each region this frame, keyed by the caller that queued them.
 *
 * @remarks
 *   Keyed by caller because that is the distinction worth drawing. One component announcing twice
 *   before the frame runs is correcting itself, so its later message replaces its earlier one. Two
 *   components announcing are two facts, and both are read.
 */
const pending = new Map<AnnouncePoliteness, Map<object, string>>();

/**
 * Hides a region off the page without taking it out of the accessibility tree, which both
 * `display: none` and `visibility: hidden` would do.
 */
const HIDDEN =
  "position:absolute;width:1px;height:1px;margin:-1px;padding:0;" +
  "overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0";

/**
 * Joins a frame's messages into the one string the region announces.
 *
 * @remarks
 *   A live region announces one string per change, so the choice is between joining every message
 *   and dropping all but one. A full stop is added only where the message before it ends in none,
 *   so "Saved" and "3 rows selected" become "Saved. 3 rows selected" while "Saved!" is left alone.
 * @param messages - The messages queued this frame, in the order they were queued.
 * @returns The joined utterance, with a message repeated in the frame appearing once.
 */
export function speakable(messages: Iterable<string>): string {
  return [...new Set(messages)].reduce(
    (said, next) => (said === "" ? next : `${said}${/[!.?]$/u.test(said) ? "" : "."} ${next}`),
    "",
  );
}

/**
 * Finds the region for a politeness, and makes one where the page holds none.
 *
 * @remarks
 *   Checked by `isConnected` rather than by whether it was made before. The map outlives the
 *   document, so anything that replaces the body leaves a detached element that is written to
 *   silently. Anything already queued was bound for that detached region and its frame never
 *   reaches the new one, so the queue is dropped with it.
 * @param politeness - How much a message written into the region may interrupt.
 * @returns The region on the page for that politeness.
 */
function regionFor(politeness: AnnouncePoliteness): HTMLElement {
  const existing = regions.get(politeness);

  if (existing?.isConnected === true) return existing;

  pending.delete(politeness);

  const region = document.createElement("div");

  region.setAttribute("aria-live", politeness);
  region.setAttribute("aria-atomic", "true");
  region.setAttribute("role", politeness === "assertive" ? "alert" : "status");
  region.style.cssText = HIDDEN;
  document.body.append(region);
  regions.set(politeness, region);

  return region;
}

/**
 * Returns a function that announces a message to a screen reader.
 *
 * @remarks
 *   `polite` waits for a gap and suits nearly everything. `assertive` interrupts whatever is being
 *   read mid-word, which suits an error that invalidates what somebody is doing and nothing else.
 *   The same message twice is announced twice. A screen reader announces a change to a region, so
 *   writing identical text is no change and is dropped, and "copied" pressed twice is two events
 *   somebody wants confirmed. Each call empties the region and writes on the next frame, which is
 *   what makes a repeat announce again. The caller is identified by an object held for the life of
 *   the component, which is never read and serves only as a key.
 * @returns The function that announces a message, stable for the life of the component.
 */
export function useAnnounce(): (message: string, politeness?: AnnouncePoliteness) => void {
  const caller = useRef({}).current;

  return useCallback(
    (message: string, politeness: AnnouncePoliteness = "polite"): void => {
      if (message === "") return;

      const region = regionFor(politeness);

      region.textContent = "";

      const queued = pending.get(politeness);

      if (queued !== undefined) {
        queued.set(caller, message);

        return;
      }

      const collecting = new Map<object, string>([[caller, message]]);

      pending.set(politeness, collecting);
      globalThis.requestAnimationFrame(() => {
        pending.delete(politeness);
        region.textContent = speakable(collecting.values());
      });
    },
    [caller],
  );
}
