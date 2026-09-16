import { describe, expect, it } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";

import { exports } from "#readme.ts";

/**
 * Writes a README into a scratch package and checks it against the given namespaces.
 *
 * @param text - The README text, or `undefined` for a package without one.
 * @param namespaces - The namespaces the barrel exports.
 * @returns The violations.
 */
function checked(text: string | undefined, namespaces: readonly string[]): readonly string[] {
  const tree = text === undefined ? {} : { "README.md": text };

  return withScratchWorkspace(tree, (workspace) => exports(workspace.root, namespaces));
}

/**
 * A README with a block table naming two namespaces.
 */
const TABLED = [
  "# leaf",
  "",
  "## Blocks",
  "",
  "Each is a namespace.",
  "",
  "| Block   | Decides   |",
  "| ------- | --------- |",
  "| `lint`  | The rules |",
  "| `fmt`   | The style |",
  "",
  "## Licence",
].join("\n");

describe("readme", () => {
  it("accepts a package without a README", () => {
    expect(checked(undefined, ["lint"])).toStrictEqual([]);
  });

  it("accepts a README without a blocks heading", () => {
    expect(checked("# leaf\n\n## Usage\n", ["lint"])).toStrictEqual([]);
  });

  it("accepts a table that names each namespace once", () => {
    expect(checked(TABLED, ["lint", "fmt"])).toStrictEqual([]);
  });

  it("reports a blocks heading with no table under it", () => {
    expect(checked("## Blocks\n\nNo table.\n\n## Next\n", ["lint"])).toStrictEqual([
      "README has a Blocks heading with no table under it",
    ]);
  });

  it("reports a block the barrel does not export", () => {
    expect(checked(TABLED, ["lint"])).toStrictEqual([
      "README names a block fmt that the barrel does not export",
    ]);
  });

  it("reports a namespace the table does not name", () => {
    expect(checked(TABLED, ["lint", "fmt", "test"])).toStrictEqual([
      "README does not name the block test",
    ]);
  });

  it("stops reading rows at the first blank line after the table", () => {
    const text = `${TABLED}\n\n| \`late\` | ignored |\n`;

    expect(checked(text, ["lint", "fmt"])).toStrictEqual([]);
  });
});
