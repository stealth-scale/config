import { describe, expect, it } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";

import { found, roots, under } from "#found.ts";

const PAGE = `export default specimen({ id: "a", scenes: [] });\n`;

describe("found", () => {
  it("returns every file a pattern matched in path order", () => {
    const held = withScratchWorkspace(
      { "src/b.specimen.tsx": PAGE, "src/nested/a.specimen.tsx": PAGE },
      (scratch) =>
        found(scratch.root, ["src/**/*.specimen.tsx"]).map((one) =>
          one.path.slice(scratch.root.length + 1),
        ),
    );

    expect(held).toStrictEqual(["src/b.specimen.tsx", "src/nested/a.specimen.tsx"]);
  });

  it("reads each file's text", () => {
    const held = withScratchWorkspace({ "src/a.specimen.tsx": PAGE }, (scratch) =>
      found(scratch.root, ["src/**/*.specimen.tsx"]),
    );

    expect(held[0]?.text).toBe(PAGE);
  });

  it("returns a file once when two patterns both match it", () => {
    const held = withScratchWorkspace({ "src/a.specimen.tsx": PAGE }, (scratch) =>
      found(scratch.root, ["src/**/*.specimen.tsx", "**/*.specimen.tsx"]),
    );

    expect(held).toHaveLength(1);
  });

  it("throws when the patterns together matched no file", () => {
    expect(() =>
      withScratchWorkspace({ "src/a.ts": PAGE }, (scratch) =>
        found(scratch.root, ["src/**/*.specimen.tsx"]),
      ),
    ).toThrow(/matched no file/u);
  });

  it.each([
    { give: "src/**/*.specimen.tsx", want: "src" },
    { give: "../../components/*/src/**/*.specimen.tsx", want: "../../components" },
    { give: "**/*.specimen.tsx", want: "." },
    { give: "src/badge/badge.specimen.tsx", want: "src/badge/badge.specimen.tsx" },
  ])("reads $give as starting under $want", ({ give, want }) => {
    expect(under(give)).toBe(want);
  });

  it("resolves each starting directory against the root", () => {
    const held = withScratchWorkspace({ "src/a.specimen.tsx": PAGE }, (scratch) =>
      roots(scratch.root, ["src/**/*.specimen.tsx"]),
    );

    expect(held).toHaveLength(1);
  });

  it("returns one directory when two patterns start in the same place", () => {
    const held = withScratchWorkspace({ "src/a.specimen.tsx": PAGE }, (scratch) =>
      roots(scratch.root, ["src/**/*.specimen.tsx", "src/**/*.page.tsx"]),
    );

    expect(held).toHaveLength(1);
  });
});
