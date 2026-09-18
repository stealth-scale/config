import { describe, expect, it } from "vitest";

import { grouped } from "#grouped.ts";
import { type Indexed } from "#types.ts";

function entry(id: string, group: string): Indexed {
  return {
    about: "",
    group,
    id,
    load: () => Promise.resolve({}),
    package: "",
    path: `src/${id}.specimen.tsx`,
    source: () => Promise.resolve({ default: "" }),
    title: id,
  };
}

describe("grouped", () => {
  it("returns one entry per group the pages declare", () => {
    const held = grouped([entry("a", "Data"), entry("b", "Actions"), entry("c", "Data")]);

    expect(held.map((one) => one.name)).toStrictEqual(["Actions", "Data"]);
  });

  it("keeps the pages of a group in the order the index gave them", () => {
    const held = grouped([entry("b", "Data"), entry("a", "Data")]);

    expect(held[0]?.pages.map((one) => one.id)).toStrictEqual(["b", "a"]);
  });

  it("collects a page that declares no group under an empty name", () => {
    const held = grouped([entry("a", "")]);

    expect(held.map((one) => one.name)).toStrictEqual([""]);
  });

  it("lists the empty name after every group the pages declare", () => {
    const held = grouped([entry("a", ""), entry("b", "Zebra"), entry("c", "Actions")]);

    expect(held.map((one) => one.name)).toStrictEqual(["Actions", "Zebra", ""]);
  });

  it("keeps the empty name last when it was found after a declared group", () => {
    const held = grouped([entry("b", "Zebra"), entry("a", "")]);

    expect(held.map((one) => one.name)).toStrictEqual(["Zebra", ""]);
  });

  it("returns nothing for an index that found no page", () => {
    expect(grouped([])).toStrictEqual([]);
  });
});
