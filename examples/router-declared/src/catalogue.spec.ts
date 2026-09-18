import { describe, expect, it } from "vitest";

import { catalogue, order, orders, shipping } from "#catalogue.ts";

describe("catalogue", () => {
  it("returns one declaration per page", async () => {
    expect((await catalogue()).map((one) => one.id)).toStrictEqual([
      orders.id,
      order.id,
      shipping.id,
    ]);
  });

  it("states every page behind an importer", async () => {
    for (const one of await catalogue()) {
      expect(one.component).toHaveProperty("load");
    }
  });

  it("nests the order page beneath the list", async () => {
    const [, nested] = await catalogue();

    expect(nested?.parent).toBe(orders.id);
  });

  it("names a frame on each page answering an address of its own", async () => {
    const [listed, nested, settings] = await catalogue();

    expect(listed?.layout).toStrictEqual(["sales"]);
    expect(settings?.layout).toStrictEqual(["sales"]);
    expect(nested?.layout).toBeUndefined();
  });
});
