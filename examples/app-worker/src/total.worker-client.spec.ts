import { describe, expect, it } from "vitest";

import { type Amount } from "@stealthscale/example-lib-core";

import { totalled, type Totaller } from "#total.worker-client.ts";

/**
 * Stands in for the worker, answering with whatever it is told to.
 *
 * @param answer - What the worker replies with.
 * @returns The stand-in, and what it was sent.
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
