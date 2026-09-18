/**
 * Stands in for the service that knows which names are taken, so a field validator has something
 * to ask.
 */

/**
 * The names already registered.
 */
const TAKEN = new Set(["roy", "admin"]);

/**
 * How long the stand-in takes to answer, in milliseconds.
 */
const LATENCY = 10;

/**
 * Waits for the latency, or until the signal aborts, whichever comes first.
 */
function delay(signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, LATENCY);

    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

/**
 * Reports whether a name is taken, after the latency a request costs.
 *
 * @remarks
 *   The signal is the one the form library hands a field's asynchronous validator, aborted when
 *   the value changes again. An aborted request answers `false` at once, and the library discards
 *   the answer of a run it aborted.
 */
export async function isTaken(username: string, signal: AbortSignal): Promise<boolean> {
  await delay(signal);

  return !signal.aborted && TAKEN.has(username);
}
