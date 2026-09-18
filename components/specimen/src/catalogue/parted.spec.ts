import { describe, expect, it } from "vitest";

import { parted } from "#catalogue/parted.ts";
import { type Anatomy, type Prop } from "#catalogue/types.ts";

function prop(name: string, kind: Prop["kind"], refers: string[] = []): Prop {
  return {
    accepts: "string",
    fallback: "",
    kind,
    name,
    refers,
    required: false,
    says: "",
  };
}

const SCALE = [{ accepts: "", name: '"sm"', says: "" }];

const ANATOMY: Anatomy = {
  dropped: { ButtonProps: { conditions: 284, foreign: 1051 } },
  parts: {
    ButtonProps: [prop("size", "variant", ["kit.Scale"]), prop("aria-label", "option")],
  },
  shapes: { "kit.Scale": SCALE },
};

describe("parted", () => {
  it("returns one entry per part the page holds", () => {
    expect(parted(ANATOMY).map((one) => one.name)).toStrictEqual(["ButtonProps"]);
  });

  it("sorts the parts by name", () => {
    const two: Anatomy = { ...ANATOMY, parts: { ButtonProps: [], Zebra: [] } };

    expect(parted(two).map((one) => one.name)).toStrictEqual(["ButtonProps", "Zebra"]);
  });

  it("groups a prop a recipe declares as a variant", () => {
    expect(parted(ANATOMY)[0]?.variants.map((row) => row.prop.name)).toStrictEqual(["size"]);
  });

  it("groups a prop the component declares as an option", () => {
    expect(parted(ANATOMY)[0]?.options.map((row) => row.prop.name)).toStrictEqual(["aria-label"]);
  });

  it("shows the members of a type a prop refers to", () => {
    expect(parted(ANATOMY)[0]?.variants[0]?.shows).toStrictEqual(SCALE);
  });

  it("shows nothing for a prop that refers to no named type", () => {
    expect(parted(ANATOMY)[0]?.options[0]?.shows).toStrictEqual([]);
  });

  it("shows nothing for a type the reader named but declined to list", () => {
    const named: Anatomy = { ...ANATOMY, shapes: {} };

    expect(parted(named)[0]?.variants[0]?.shows).toStrictEqual([]);
  });

  it("carries the counts of what no table draws", () => {
    expect(parted(ANATOMY)[0]?.dropped).toStrictEqual({ conditions: 284, foreign: 1051 });
  });

  it("reports no drops for a part the reader recorded none against", () => {
    const quiet: Anatomy = { ...ANATOMY, dropped: {} };

    expect(parted(quiet)[0]?.dropped).toStrictEqual({ conditions: 0, foreign: 0 });
  });

  it("keeps a part the reader found no prop for", () => {
    const empty: Anatomy = { dropped: {}, parts: { GhostProps: [] }, shapes: {} };

    expect(parted(empty)).toHaveLength(1);
  });

  it("returns nothing for a page with no part", () => {
    expect(parted({ dropped: {}, parts: {}, shapes: {} })).toStrictEqual([]);
  });
});
