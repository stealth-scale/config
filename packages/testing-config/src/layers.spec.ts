import { describe, expect, it } from "vitest";

import {
  flattened,
  type Found,
  isLayer,
  kind,
  type Layer,
  layersOf,
  named,
  reason,
  reasoned,
  repeated,
  unique,
} from "#layers.ts";

/**
 * Builds a layer for a check to read.
 *
 * @param name - The layer name.
 * @param layerKind - The layer kind.
 * @param because - The reason, where the kind carries one.
 * @returns The layer.
 */
function layer(name: string, layerKind: Layer["kind"] = "preset", because?: string): Layer {
  return because === undefined ? { kind: layerKind, name } : { because, kind: layerKind, name };
}

/**
 * Builds the return value record of one factory.
 *
 * @param path - The factory path.
 * @param layers - The layers the factory returned.
 * @param listed - Whether the factory returned an array.
 * @returns The record.
 */
function found(path: string, layers: readonly Layer[], listed = true): Found {
  return { error: undefined, layers, listed, others: [], path };
}

describe("layers", () => {
  it("recognises a record with a name and one of the four kinds", () => {
    expect(isLayer({ kind: "preset", name: "a" })).toBe(true);
    expect(isLayer({ kind: "other", name: "a" })).toBe(false);
    expect(isLayer({ name: "a" })).toBe(false);
    expect(isLayer("a")).toBe(false);
  });

  it("flattens nested arrays and wraps a single value", () => {
    expect(flattened([1, [2, [3]]])).toStrictEqual([1, 2, 3]);
    expect(flattened(1)).toStrictEqual([1]);
  });

  it("reads the message of an error and the string form of anything else", () => {
    expect(reason(new Error("broken"))).toBe("broken");
    expect(reason("broken")).toBe("broken");
  });

  it("calls a factory with the supplied arguments and sorts the result", () => {
    const factory = {
      call: (name: unknown): unknown[] => [layer(String(name)), "extra"],
      path: "a",
    };
    const [result] = layersOf([factory], { a: ["x"] });

    expect(result?.layers).toStrictEqual([layer("x")]);
    expect(result?.others).toStrictEqual(["extra"]);
    expect(result?.listed).toBe(true);
  });

  it("skips a factory with required parameters and no arguments entry", () => {
    const factory = { call: (name: unknown): Layer => layer(String(name)), path: "a" };

    expect(layersOf([factory], {})).toStrictEqual([]);
  });

  it("records the message when a factory throws", () => {
    const factory = {
      call: (): never => {
        throw new Error("no manifest");
      },
      path: "a",
    };

    expect(layersOf([factory], {})[0]?.error).toBe("no manifest");
  });

  it("reports a factory that throws", () => {
    expect(kind([{ ...found("a", []), error: "no manifest" }])).toStrictEqual([
      "a throws when called: no manifest",
    ]);
  });

  it("reports a record shaped like a layer that is not one", () => {
    expect(kind([{ ...found("a", [], false), others: [{ name: "x" }] }])).toStrictEqual([
      "a returns something shaped like a layer that is not one",
    ]);
    expect(kind([{ ...found("b", [], false), others: [{ kind: "preset" }] }])).toHaveLength(1);
  });

  it("reports an array that mixes layers with other values", () => {
    expect(kind([{ ...found("a", [layer("a")]), others: ["x"] }])).toStrictEqual([
      "a returns an array holding something that is not a layer",
    ]);
  });

  it("accepts a helper that returns no layer", () => {
    expect(kind([{ ...found("a", [], false), others: ["1.0.0"] }])).toStrictEqual([]);
  });

  it("accepts a single layer named for its factory path", () => {
    expect(named([found("lint.relax", [layer("lint.relax(**/*.ts)")], false)], "")).toStrictEqual(
      [],
    );
  });

  it("prefixes the expected name with the package prefix", () => {
    expect(
      named([found("lint.rendered", [layer("react.lint.rendered")], false)], "react"),
    ).toStrictEqual([]);
  });

  it("reports a single layer named for another call", () => {
    expect(named([found("lint.rendered", [layer("lint.relax(x)")], false)], "react")).toStrictEqual(
      ["lint.rendered returns lint.relax(x), which is not named for the call"],
    );
  });

  it("reports a name that carries an owner", () => {
    expect(named([found("layers", [layer("react/refresh")])], "react")).toStrictEqual([
      "layers returns react/refresh, whose name carries an owner",
    ]);
  });

  it("accepts an array whose layers stay inside the block", () => {
    expect(named([found("lint.preset.node", [layer("lint.node")])], "")).toStrictEqual([]);
  });

  it("reports an array layer outside the block", () => {
    expect(named([found("lint.preset.node", [layer("pack.carry")])], "")).toStrictEqual([
      "lint.preset.node returns pack.carry, which is not named for the call",
    ]);
  });

  it("holds a top-level array to the package prefix alone", () => {
    expect(named([found("layers", [layer("react.plugin.refresh")])], "react")).toStrictEqual([]);
    expect(named([found("layers", [layer("css.check")])], "react")).toHaveLength(1);
  });

  it("reports a departure with an empty reason and a preset with one", () => {
    const layers = [
      layer("a", "contribution", " "),
      layer("b", "removal"),
      layer("c", "preset", "why"),
      layer("d", "override", "why"),
    ];

    expect(reasoned([found("x", layers)])).toStrictEqual([
      "a is a contribution with an empty because",
      "b is a removal with an empty because",
      "c is a preset carrying a because",
    ]);
  });

  it("names a repeated name once and ignores a repeat across kinds", () => {
    const layers = [layer("a"), layer("a"), layer("a"), layer("b", "removal"), layer("b")];

    expect(repeated(layers)).toStrictEqual(["a"]);
  });

  it("reports a factory that returns two layers under one name", () => {
    expect(unique([found("x", [layer("a"), layer("a")])])).toStrictEqual([
      "x returns two layers named a",
    ]);
  });
});
