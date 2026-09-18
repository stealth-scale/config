import { describe, expect, it } from "vitest";

import { type ScratchFiles, withScratchWorkspace } from "@stealthscale/testing";

import { type Published } from "#manifest.ts";
import { declared, jsx, specs } from "#source.ts";

const VALUE = "export function held(): number {\n  return 1;\n}\n";

const TYPES = "export type Held = string;\n\nexport type { Other } from 'elsewhere';\n";

const INTERFACES = "export interface Held {\n  readonly name: string;\n}\n";

const MANIFEST: Published = { name: "@scope/held", peerDependencies: { react: "catalog:" } };

function checked(tree: ScratchFiles): readonly string[] {
  return withScratchWorkspace(tree, (workspace) => specs(workspace.root));
}

function imported(tree: ScratchFiles, published: Published = MANIFEST): readonly string[] {
  return withScratchWorkspace(tree, (workspace) => declared(workspace.root, published));
}

function suffixed(tree: ScratchFiles): readonly string[] {
  return withScratchWorkspace(tree, (workspace) => jsx(workspace.root));
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

  it("leaves a module exporting interfaces alone because they compile to nothing too", () => {
    expect(checked({ "src/held.ts": INTERFACES })).toStrictEqual([]);
  });

  it("names a module exporting an interface beside a value", () => {
    expect(checked({ "src/held.ts": `${INTERFACES}\n${VALUE}` })).toStrictEqual([
      "src/held.ts has no specification beside it",
    ]);
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

describe("declared", () => {
  it("accepts a package with nothing under src", () => {
    expect(imported({})).toStrictEqual([]);
  });

  it("accepts an import the manifest peers on", () => {
    expect(imported({ "src/held.ts": 'import { useId } from "react";\n' })).toStrictEqual([]);
  });

  it("accepts an import the manifest installs", () => {
    const published = { ...MANIFEST, dependencies: { zod: "^4.0.0" } };

    expect(imported({ "src/held.ts": 'import { z } from "zod";\n' }, published)).toStrictEqual([]);
  });

  it("names an import the manifest does not declare", () => {
    expect(imported({ "src/held.ts": 'import { render } from "elsewhere";\n' })).toStrictEqual([
      "src/held.ts imports elsewhere, which the manifest does not declare",
    ]);
  });

  it("names a scoped import by its scope and its name together", () => {
    expect(imported({ "src/held.ts": 'import { theme } from "@scope/theme";\n' })).toStrictEqual([
      "src/held.ts imports @scope/theme, which the manifest does not declare",
    ]);
  });

  it("reads a subpath as the package that publishes it", () => {
    expect(
      imported({ "src/held.ts": 'import { m } from "react/compiler-runtime";\n' }),
    ).toStrictEqual([]);
  });

  it("reads a scoped subpath as the package that publishes it", () => {
    const published = { ...MANIFEST, peerDependencies: { "@scope/theme": "workspace:^" } };
    const tree = { "src/held.ts": 'import { recipe } from "@scope/theme/authoring";\n' };

    expect(imported(tree, published)).toStrictEqual([]);
  });

  it("reads past a relative import because it names a file", () => {
    expect(imported({ "src/held.ts": 'import { near } from "./near.ts";\n' })).toStrictEqual([]);
  });

  it("reads past a subpath import because the package declares it itself", () => {
    expect(imported({ "src/held.ts": 'import { near } from "#near.ts";\n' })).toStrictEqual([]);
  });

  it("reads past a builtin because a runtime supplies it", () => {
    expect(imported({ "src/held.ts": 'import { join } from "node:path";\n' })).toStrictEqual([]);
  });

  it("reads past a virtual module because a bundler plugin answers it", () => {
    expect(
      imported({ "src/held.ts": 'import { catalogues } from "virtual:i18n";\n' }),
    ).toStrictEqual([]);
  });

  it("reads what a module re-exports as an import too", () => {
    expect(imported({ "src/index.ts": 'export { Portal } from "elsewhere";\n' })).toStrictEqual([
      "src/index.ts imports elsewhere, which the manifest does not declare",
    ]);
  });

  it("reads an import taken for its side effect alone", () => {
    expect(imported({ "src/held.ts": 'import "elsewhere/styles.css";\n' })).toStrictEqual([
      "src/held.ts imports elsewhere, which the manifest does not declare",
    ]);
  });

  it("reads past an import written inside a template literal for somebody else to run", () => {
    const tree = { "src/held.ts": 'const code = `import { x } from "elsewhere";`;\n' };

    expect(imported(tree)).toStrictEqual([]);
  });

  it("reads an import spread over several lines", () => {
    const tree = { "src/held.ts": 'import {\n  one,\n  two,\n} from "elsewhere";\n' };

    expect(imported(tree)).toStrictEqual([
      "src/held.ts imports elsewhere, which the manifest does not declare",
    ]);
  });

  it("reads past a string that follows an export on a line of its own", () => {
    expect(imported({ "src/held.ts": 'export const NAME = "elsewhere";\n' })).toStrictEqual([]);
  });

  it("reads past a specification because it runs in the workspace", () => {
    expect(imported({ "src/held.spec.ts": 'import { it } from "vitest";\n' })).toStrictEqual([]);
  });

  it("reads past a fixture for the same reason", () => {
    expect(imported({ "src/held.fixtures.ts": 'import { it } from "vitest";\n' })).toStrictEqual(
      [],
    );
  });

  it("names every undeclared import it finds in path order", () => {
    const tree = {
      "src/a/two.ts": 'import { two } from "second";\n',
      "src/one.ts": 'import { one } from "first";\n',
    };

    expect(imported(tree)).toStrictEqual([
      "src/a/two.ts imports second, which the manifest does not declare",
      "src/one.ts imports first, which the manifest does not declare",
    ]);
  });
});

describe("jsx", () => {
  it("accepts a package with nothing under src", () => {
    expect(suffixed({})).toStrictEqual([]);
  });

  it("accepts a file suffixed tsx that draws a closing tag", () => {
    expect(suffixed({ "src/held.tsx": "const held = <p>Here</p>;\n" })).toStrictEqual([]);
  });

  it("accepts a file suffixed tsx that draws a self-closing tag", () => {
    expect(suffixed({ "src/held.tsx": "const held = <Portal />;\n" })).toStrictEqual([]);
  });

  it("accepts a file suffixed tsx that draws a namespaced tag", () => {
    expect(suffixed({ "src/held.tsx": "const held = <Skip.Link>Go</Skip.Link>;\n" })).toStrictEqual(
      [],
    );
  });

  it("names a file suffixed tsx that writes no JSX", () => {
    expect(suffixed({ "src/held.tsx": VALUE })).toStrictEqual([
      "src/held.tsx writes no JSX, so its suffix is ts",
    ]);
  });

  it("names a specification suffixed tsx that writes no JSX", () => {
    expect(suffixed({ "src/held.spec.tsx": VALUE })).toStrictEqual([
      "src/held.spec.tsx writes no JSX, so its suffix is ts",
    ]);
  });

  it("leaves a file suffixed ts alone because a compiler refuses JSX in one", () => {
    expect(suffixed({ "src/held.ts": VALUE })).toStrictEqual([]);
  });

  it("names every file it finds in path order", () => {
    expect(suffixed({ "src/a/two.tsx": VALUE, "src/one.tsx": VALUE })).toStrictEqual([
      "src/a/two.tsx writes no JSX, so its suffix is ts",
      "src/one.tsx writes no JSX, so its suffix is ts",
    ]);
  });
});
