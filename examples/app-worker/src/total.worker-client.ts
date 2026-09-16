/**
 * Turns the worker's message exchange into a promise the page can await.
 *
 * @remarks
 *   The worker is described by the two members this module actually calls, so a
 *   test drives it with an object literal and needs no worker runtime.
 */

import { type Amount } from "@stealthscale/example-lib-core";

/**
 * The part of a worker that sends a run of amounts and hears the total back.
 *
 * @remarks
 *   A DOM Worker satisfies this without being cast. Describing two members rather
 *   than the whole interface also keeps this module away from terminate, which
 *   would end a worker its caller still owns.
 */
export interface Totaller {
  /**
   * Registers the listener that each reply from the worker is handed to.
   */
  addEventListener: (
    of: "message",
    held: (event: MessageEvent<Amount | undefined>) => void,
  ) => void;

  /**
   * Hands the worker a run of amounts to total.
   */
  postMessage: (amounts: readonly Amount[]) => void;
}

/**
 * Sends a run of amounts to a worker and settles with the total it sends back.
 *
 * @remarks
 *   The listener goes on before the run is sent, so a worker replying inside
 *   postMessage is still heard. The listener is never taken off and the wait is
 *   never timed out, so a worker that throws on the run, or answers a different
 *   request, leaves the promise pending.
 * @returns The total the worker computed, or undefined for an empty run.
 */
export function totalled(
  worker: Totaller,
  amounts: readonly Amount[],
): Promise<Amount | undefined> {
  const answer = new Promise<Amount | undefined>((settle) => {
    worker.addEventListener("message", (held) => {
      settle(held.data);
    });
  });

  worker.postMessage(amounts);

  return answer;
}
