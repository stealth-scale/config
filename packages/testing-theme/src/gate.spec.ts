import { describe, expect, it } from "vitest";

import { gated } from "#gate.ts";

const RUNNERS = [
  ["one", (): readonly string[] => ["first thing"]],
  ["two", (): readonly string[] => []],
  ["three", (): readonly string[] => ["second thing", "third thing"]],
] as const;

describe("gated", () => {
  it("opens every violation with the check that reported it", () => {
    expect(gated(RUNNERS, {})).toStrictEqual([
      "one: first thing",
      "three: second thing",
      "three: third thing",
    ]);
  });

  it("leaves out a check the specification skips", () => {
    expect(gated(RUNNERS, { skip: { three: "measured in the browser instead" } })).toStrictEqual([
      "one: first thing",
    ]);
  });

  it("reports a skip that gives no reason before anything a check found", () => {
    expect(gated(RUNNERS, { skip: { one: "  " } })).toStrictEqual([
      "skip of one gives no reason",
      "three: second thing",
      "three: third thing",
    ]);
  });

  it("reports nothing for a gate whose every check is quiet", () => {
    expect(gated([["two", (): readonly string[] => []]], {})).toStrictEqual([]);
  });
});
