import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { omit, prepare, thresholds } from "#test/departure.ts";

describe("departure", () => {
  it("stops counting one glob at a time", () => {
    const held = omit({ because: "a shim", files: ["a/**", "b/**"] });

    expect(held.map((one) => one.item)).toStrictEqual(["a/**", "b/**"]);
  });

  it("appends to what the tier already leaves out rather than replacing it", () => {
    for (const held of omit({ because: "a shim", files: ["a/**"] })) {
      expect(held.at).toBe("test.coverage.exclude");
    }
  });

  it("names each omitted glob", () => {
    expect(omit({ because: "a shim", files: ["a/**"] })[0]?.name).toBe("test.omit(a/**)");
  });

  it("lowers only what it names", () => {
    const held = (thresholds({ branches: 70 }).config as UserConfig).test?.coverage?.thresholds;

    expect(held).toStrictEqual({ branches: 70 });
  });

  it("names what it lowered", () => {
    expect(thresholds({ branches: 70, lines: 90 }).name).toBe("test.thresholds(branches, lines)");
  });

  it("runs a file once around the whole suite rather than once per test file", () => {
    const held = prepare({ because: "a database", files: ["/a/db.ts"] });

    expect(held[0]?.at).toBe("test.globalSetup");
  });

  it("contributes one file at a time", () => {
    const held = prepare({ because: "a database", files: ["/a/db.ts", "/a/queue.ts"] });

    expect(held.map((one) => one.name)).toStrictEqual([
      "test.prepare(/a/db.ts)",
      "test.prepare(/a/queue.ts)",
    ]);
  });
});
