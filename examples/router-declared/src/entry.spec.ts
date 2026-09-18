import { describe, expect, it } from "vitest";

import { type RouteDeclaration } from "@stealthscale/provider-router";

import { catalogue, type Condition } from "#catalogue.ts";
import { entryOf } from "#entry.ts";

/**
 * Reads the declaration at a place in the catalogue.
 *
 * @param index - Which declaration to read.
 * @returns The declaration.
 * @throws {@link Error} Where the catalogue is shorter than that.
 */
async function declarationAt(index: number): Promise<RouteDeclaration<Condition>> {
  const found = (await catalogue())[index];

  if (found === undefined) {
    throw new Error(`The catalogue holds no declaration at ${String(index)}.`);
  }

  return found;
}

describe("entryOf", () => {
  it("reads the label and the order a declaration carries", async () => {
    expect(entryOf(await declarationAt(0))).toStrictEqual({ label: "Orders", order: 1 });
  });

  it("returns nothing for a declaration carrying no entry", async () => {
    expect(entryOf(await declarationAt(1))).toBeUndefined();
  });

  it("returns nothing where the entry is another shape", async () => {
    const listed = await declarationAt(0);

    expect(entryOf({ ...listed, navigation: "Orders" })).toBeUndefined();
    expect(entryOf({ ...listed, navigation: null })).toBeUndefined();
    expect(entryOf({ ...listed, navigation: { order: 1 } })).toBeUndefined();
    expect(entryOf({ ...listed, navigation: { label: 1, order: 1 } })).toBeUndefined();
    expect(entryOf({ ...listed, navigation: { label: "Orders" } })).toBeUndefined();
  });

  it("returns nothing where the order is not a number", async () => {
    const listed = await declarationAt(0);

    expect(entryOf({ ...listed, navigation: { label: "Orders", order: "1" } })).toBeUndefined();
  });
});
