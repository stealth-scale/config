/**
 * Talking to the worker, kept apart from the page so it can be specified without one.
 */

import { type Amount } from "@stealthscale/example-lib-core";

/**
 * The part of a worker this needs, so a specification can stand in for one.
 */
export interface Totaller {
  /**
   * Registers what to do with the worker's answer.
   */
  addEventListener: (
    of: "message",
    held: (event: MessageEvent<Amount | undefined>) => void,
  ) => void;

  /**
   * Sends the amounts to be totalled.
   */
  postMessage: (amounts: readonly Amount[]) => void;
}

/**
 * Asks the worker for a total and waits for the answer.
 *
 * A worker answers by event rather than by return, so what a caller wants — a value it can await —
 * has to be built here. Written against the two methods it uses rather than against `Worker`, so
 * what it does can be specified without starting a thread.
 *
 * @param worker - The worker to ask.
 * @param amounts - The amounts to total.
 * @returns The total, or nothing where there was nothing to total.
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
