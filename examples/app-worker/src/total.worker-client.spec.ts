/**
 * Checks the client against a stand-in worker, with no worker runtime present.
 *
 * @remarks
 *   A real worker would make each assertion wait on a thread and a module graph
 *   for arithmetic these tests are not measuring. The stand-in answers in the same
 *   turn, which is also the timing most likely to lose a reply.
 */

import { describe, expect, it } from "vitest";

import { type Amount } from "@stealthscale/example-lib-core";

import { totalled, type Totaller } from "#total.worker-client.ts";

/**
 * Builds a worker that records what it was sent and replies with one fixed answer.
 *
 * @remarks
 *   The reply is delivered from inside postMessage, before it returns. A client
 *   that registered its listener after sending would miss it, so this timing is
 *   what makes the ordering in the client observable.
 * @param answer - The total to reply with. Leaving it out replies with undefined,
 *   as a worker does for an empty run.
 * @returns The stand-in worker, and the array holding each run it received.
 */
function standing(answer?: Amount): { sent: Amount[][]; worker: Totaller } {
  const sent: Amount[][] = [];
  let reply: ((held: MessageEvent<Amount | undefined>) => void) | undefined = undefined;

  return {
    sent,
    worker: {
      addEventListener: (_of, held) => {
        reply = held;
      },
      postMessage: (amounts) => {
        sent.push([...amounts]);
        reply?.({ data: answer } as MessageEvent<Amount | undefined>);
      },
    },
  };
}

describe("total.worker-client", () => {
  it("answers with what the worker replied", async () => {
    const held = standing({ cents: 425, currency: "EUR" });

    await expect(totalled(held.worker, [{ cents: 425, currency: "EUR" }])).resolves.toStrictEqual({
      cents: 425,
      currency: "EUR",
    });
  });

  it("sends the worker exactly what it was given", async () => {
    const held = standing();

    await totalled(held.worker, [{ cents: 1, currency: "EUR" }]);

    expect(held.sent).toStrictEqual([[{ cents: 1, currency: "EUR" }]]);
  });

  it("answers nothing where the worker had nothing to total", async () => {
    const held = standing();

    await expect(totalled(held.worker, [])).resolves.toBeUndefined();
  });
});
