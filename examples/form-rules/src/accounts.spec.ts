import { describe, expect, it } from "vitest";

import { isTaken } from "#accounts.ts";

describe("isTaken", () => {
  it("reports a registered name as taken and another as free", async () => {
    const { signal } = new AbortController();

    await expect(isTaken("roy", signal)).resolves.toBe(true);
    await expect(isTaken("ann", signal)).resolves.toBe(false);
  });

  it("answers false at once when the request is aborted", async () => {
    const controller = new AbortController();
    const asked = isTaken("roy", controller.signal);

    controller.abort();

    await expect(asked).resolves.toBe(false);
  });
});
