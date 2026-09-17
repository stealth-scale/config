import { describe, expect, it } from "vitest";

import { type ScratchFiles, withScratchWorkspace } from "@stealthscale/testing";

import { specs } from "#source.ts";

const VALUE = "export function held(): number {\n  return 1;\n}\n";

const TYPES = "export type Held = string;\n\nexport type { Other } from 'elsewhere';\n";

function checked(tree: ScratchFiles): readonly string[] {
  return withScratchWorkspace(tree, (workspace) => specs(workspace.root));
}

describe("specs", () => {
  it("accepts a package with nothing under src", () => {
    expect(checked({})).toStrictEqual([]);
  });

  it("accepts a source with a specification beside it", () => {
    expect(checked({ "src/held.spec.ts": "", "src/held.ts": VALUE })).toStrictEqual([]);
  });

  it("accepts a source whose specification renders", () => {
    expect(checked({ "src/held.spec.tsx": "", "src/held.ts": VALUE })).toStrictEqual([]);
  });

  it("names a source with no specification beside it", () => {
    expect(checked({ "src/held.ts": VALUE })).toStrictEqual([
      "src/held.ts has no specification beside it",
    ]);
  });

  it("names a source nested under a block", () => {
    expect(checked({ "src/stores/held.ts": VALUE })).toStrictEqual([
      "src/stores/held.ts has no specification beside it",
    ]);
  });

  it("names every source it finds in path order", () => {
    expect(checked({ "src/a/two.ts": VALUE, "src/one.ts": VALUE })).toStrictEqual([
      "src/a/two.ts has no specification beside it",
      "src/one.ts has no specification beside it",
    ]);
  });

  it("leaves a barrel to the conformance specification that already reads one", () => {
    expect(checked({ "src/index.ts": VALUE })).toStrictEqual([]);
  });

  it("leaves a barrel nested under a block alone", () => {
    expect(checked({ "src/lint/index.ts": VALUE })).toStrictEqual([]);
  });

  it("names a barrel with no specification beside it where the package asks for barrels", () => {
    const found = withScratchWorkspace(
      { "src/index.ts": VALUE, "src/list/index.spec.ts": "", "src/list/index.ts": VALUE },
      (workspace) => specs(workspace.root, true),
    );

    expect(found).toStrictEqual(["src/index.ts has no specification beside it"]);
  });

  it("leaves a fixture alone because it holds no behaviour", () => {
    expect(checked({ "src/held.fixtures.tsx": VALUE })).toStrictEqual([]);
  });

  it("leaves a declaration file alone", () => {
    expect(checked({ "src/held.d.ts": TYPES })).toStrictEqual([]);
  });

  it("leaves a module exporting types alone because it compiles to nothing", () => {
    expect(checked({ "src/held.ts": TYPES })).toStrictEqual([]);
  });

  it("names a module exporting a type beside a value", () => {
    expect(checked({ "src/held.ts": `${TYPES}\n${VALUE}` })).toStrictEqual([
      "src/held.ts has no specification beside it",
    ]);
  });

  it("names a module that exports nothing at all", () => {
    expect(checked({ "src/held.ts": "const held = 1;\n" })).toStrictEqual([
      "src/held.ts has no specification beside it",
    ]);
  });

  it("reads a specification as a specification rather than as a source", () => {
    expect(checked({ "src/held.spec.ts": VALUE })).toStrictEqual([]);
  });
});
