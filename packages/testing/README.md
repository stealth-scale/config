# @stealthscale/testing

`@stealthscale/testing` builds a scratch directory for a specification under the system temporary
directory, and writes the package manifests that fill it. The remaining exports read a CSS length
and the gap between two laid-out elements. A specification owns everything in its workspace, so it
may assert an exact file count and exact names. Vitest is a peer dependency, and no export calls
into it.

## Install

```bash
pnpm add -D @stealthscale/testing
```

The package peers on `vitest` and requires Node 26 or later.

## Usage

```ts
import { expect, it } from "vitest";

import {
  manifest,
  packageFiles,
  withScratchWorkspace,
  workspaceFiles,
} from "@stealthscale/testing";

it("writes the manifest of every package in the tree", () => {
  const tree = {
    ...workspaceFiles(["packages/*"]),
    ...packageFiles("packages/leaf", { name: "@acme/leaf" }, { "src/index.ts": "export {};\n" }),
  };

  withScratchWorkspace(tree, (workspace) => {
    expect(workspace.files()).toStrictEqual([
      "package.json",
      "packages/leaf/package.json",
      "packages/leaf/src/index.ts",
    ]);
    expect(workspace.read("packages/leaf/package.json")).toBe(manifest({ name: "@acme/leaf" }));
  });
});
```

`packageFiles` and `workspaceFiles` key every file from the workspace root, so spreading them into
one object describes a whole tree. `withScratchWorkspace` writes that object under the system
temporary directory and hands the function a workspace. The directory goes whether the function
returns or throws, and an error it raised reaches the caller unchanged. The operating system
supplies the last part of the directory name, so two calls never collide.

## Reference

### Scratch workspaces

| Export                      | Signature                                                                                                 | What it does                                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `ScratchFiles`              | `Readonly<Record<string, string>>`                                                                        | File contents, keyed by a path relative to the workspace root. A separator in a key creates the directories above the file |
| `scratchWorkspace`          | `(files?: ScratchFiles) => ScratchWorkspace`                                                              | Makes a directory under the system temporary directory, writes `files` into it, and leaves it on disk                      |
| `withScratchWorkspace`      | `<Result>(files: ScratchFiles, run: (workspace: ScratchWorkspace) => Result) => Result`                   | Runs `run` against a fresh workspace, deletes the directory, and returns the value `run` produced                          |
| `withScratchWorkspaceAsync` | `<Result>(files: ScratchFiles, run: (workspace: ScratchWorkspace) => Promise<Result>) => Promise<Result>` | Awaits `run` against a fresh workspace and deletes the directory once its promise settles                                  |
| `ScratchWorkspace`          | `class`                                                                                                   | Owns one directory for the length of one test, and deletes nothing on its own                                              |

### ScratchWorkspace

| Member        | Signature                       | What it does                                                                                                        |
| ------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `root`        | `readonly string`               | The absolute path of the directory this workspace owns                                                              |
| `constructor` | `(root: string)`                | Adopts a directory that already exists, without creating or emptying it                                             |
| `files`       | `() => string[]`                | Lists every file as a path relative to the root, sorted, separated by `/`. A directory with no file in it is absent |
| `path`        | `(relative: string) => string`  | Resolves a path against the root and returns it absolute. Throws when the path resolves outside the root            |
| `read`        | `(relative: string) => string`  | Reads a file in the workspace as UTF-8 text                                                                         |
| `remove`      | `() => void`                    | Deletes the directory and everything below it. A second call does nothing                                           |
| `write`       | `(files: ScratchFiles) => void` | Writes each file and creates the directories above it. An existing file is overwritten and no other file is touched |

### Manifests

| Export           | Signature                                                                                     | What it does                                                                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `ManifestFields` | `{ readonly name: string; readonly [field: string]: unknown }`                                | Declares the name a package resolves under. Any further field is serialised as it is given                                                      |
| `manifest`       | `(fields: ManifestFields) => string`                                                          | Serialises the fields as JSON indented two spaces, ending in a newline, with `version` set to `0.0.0` unless the fields set one                 |
| `packageFiles`   | `(directory: string, fields: ManifestFields, files?: ScratchFiles) => ScratchFiles`           | Places a package's manifest and the rest of its files under `directory`, keyed by their path from the workspace root                            |
| `workspaceFiles` | `(workspaces: readonly string[], fields?: Readonly<Record<string, unknown>>) => ScratchFiles` | Declares a workspace root over the globs its packages live under. The root is named `root` and marked private, and `fields` is merged over both |

### Measurement

| Export        | Signature                                       | What it does                                                                                                                                                            |
| ------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Box`         | `{ left: number; right: number }`               | The horizontal edges of a rectangle, in CSS pixels. A `DOMRect` satisfies this and is accepted unchanged. The vertical edges are absent because nothing here reads them |
| `Measured`    | `{ getBoundingClientRect: () => Box }`          | Reports the rectangle a thing occupies at the moment of the call                                                                                                        |
| `pixels`      | `(length: string) => number`                    | Reads the number in front of a CSS unit, and returns 0 where there is no number to read                                                                                 |
| `seamBetween` | `(first: Measured, second: Measured) => number` | Returns the distance in CSS pixels between the first element's right edge and the second element's left edge                                                            |

## Cleanup

Call `remove` on any `ScratchWorkspace` you made directly. No deletion is scheduled for you, and a
directory that nobody removes remains under the system temporary directory until the machine clears
it. A second `remove` does nothing rather than throwing, so a specification that removes the
workspace in the body and again in a teardown is safe. Reads through the instance throw once the
directory is gone.

Warning: `withScratchWorkspace` does not await the function it runs. A function returning a promise
loses its directory while it is still running, which is the case `withScratchWorkspaceAsync` covers.
Work that a function starts and does not await loses the directory under it either way.

## Measuring in a document

Rendering an element requires a DOM environment under Vitest, and `seamBetween` then reads whatever
`getBoundingClientRect` returns. A runner that lays nothing out returns zero for every rectangle, so
a specification there measures a stub of its own rather than the element it rendered. Real numbers
come from a browser run, which is where a test that depends on layout belongs.

`Measured` is structural. A DOM element satisfies it without a cast, and so does a plain object with
two fixed numbers. A specification under a runner that lays nothing out states both edges itself:

```ts
import { expect, it } from "vitest";

import { type Measured, seamBetween } from "@stealthscale/testing";

const boxed = (left: number, right: number): Measured => ({
  getBoundingClientRect: () => ({ left, right }),
});

it("returns a positive distance when the two overlap", () => {
  expect(seamBetween(boxed(0, 80), boxed(72, 160))).toBe(8);
});
```

`seamBetween` returns an unsigned distance, so two elements overlapping by 8 pixels and two
separated by 8 pixels both measure 8. A caller that has to know which of the two it has compares the
edges itself.

`pixels` reads a CSS length string rather than an element, so it runs without a document. Reading
stops at the first character that cannot continue a number, so `16px` gives 16, `0.5rem` gives 0.5
and `auto` gives 0. A caller cannot tell a measured zero from a length this failed to read.

## Licence

MIT. See [LICENSE](LICENSE).
