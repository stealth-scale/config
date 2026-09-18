/**
 * Reads every source file under a package's `src`: the specification beside it, the packages it
 * imports, and whether its suffix matches what it holds.
 *
 * @remarks
 *   The pairing is by path rather than by what a specification imports, so a file whose cases were
 *   folded into a sibling's specification reads as uncovered. That is the point: a reader opening a
 *   source file finds its cases in one place, and a file nobody wrote cases for is visible without
 *   reading any of them.
 */

import { existsSync, globSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

import { type Published } from "#manifest.ts";

/**
 * The files a package's sources are found in.
 */
const SOURCES = "src/**/*.{ts,tsx}";

/**
 * The suffixes a file carries when it is not itself a source.
 *
 * @remarks
 *   A specimen belongs here for the reason a fixture does. It declares a page for a catalogue to
 *   draw rather than behaviour to assert, and it runs in the catalogue rather than in the package
 *   it documents, so it resolves what it imports through the workspace root.
 */
const APART = [".spec.ts", ".spec.tsx", ".fixtures.ts", ".fixtures.tsx", ".specimen.tsx", ".d.ts"];

/**
 * The files a barrel is named, which gather a block rather than declare one.
 */
const BARRELS = new Set(["index.ts", "index.tsx"]);

/**
 * The suffixes a specification may carry, whichever suffix its source has.
 */
const BESIDE = [".spec.ts", ".spec.tsx"];

/**
 * Matches a line that exports something.
 */
const EXPORTS = /^export\b/mu;

/**
 * Matches a line that exports a type and nothing that survives compilation.
 */
const EXPORTS_TYPE = /^export (?:interface|type)\b/mu;

/**
 * Matches the specifier of every module a file imports or re-exports.
 *
 * @remarks
 *   Both patterns start at a line, because a statement does, and neither crosses a quote or a
 *   semicolon. That is what keeps an import written inside a template literal out, which a package
 *   generating code for somebody else writes and never runs itself.
 */
const SPECIFIERS = [
  /^\s*(?:import|export)\b[^"';]*?\bfrom\s*"([^"]+)"/gmu,
  /^\s*import\s+"([^"]+)"/gmu,
];

/**
 * Matches a closing or self-closing tag, which no file without JSX carries.
 */
const TAGS = /<\/[A-Za-z][\w.]*>|\/>/u;

/**
 * Tells whether a path is a source rather than a specification or a fixture, and rather than a
 * barrel unless barrels count.
 */
function named(path: string, barrels: boolean): boolean {
  const file = basename(path);

  return !APART.some((one) => file.endsWith(one)) && (barrels || !BARRELS.has(file));
}

/**
 * Tells whether a file contributes anything a specification could run.
 *
 * @remarks
 *   A module whose every export is an `export type` or an `export interface` compiles to nothing,
 *   so there is no behaviour to write cases against. The test reads the text rather than the syntax
 *   tree, which is enough because an export written any other way puts a value in the output.
 */
function declares(at: string, path: string): boolean {
  const held = readFileSync(join(at, path), "utf8");
  const exported = held.split("\n").filter((line) => EXPORTS.test(line));

  return exported.length === 0 || !exported.every((line) => EXPORTS_TYPE.test(line));
}

/**
 * Reports every source file with no specification beside it.
 *
 * @remarks
 *   A barrel is left alone unless the package asks for barrels. It re-exports what the files
 *   around it declare, and the conformance specification every package already runs is what
 *   reads a barrel. A component package asks for barrels, because a barrel there is where a
 *   component's public surface is written and where a recipe or a binding leaks out. A fixture,
 *   a declaration file and a module exporting types alone are left alone in every package, since
 *   none of them holds behaviour of its own.
 * @param at - The directory holding the package's manifest.
 * @param barrels - Whether a barrel needs a specification beside it too.
 * @returns One violation per source file with no specification, or an empty array.
 */
export function specs(at: string, barrels = false): readonly string[] {
  const found = globSync(SOURCES, { cwd: at }).filter(
    (path) => named(path, barrels) && declares(at, path),
  );

  return found
    .filter((path) => !BESIDE.some((one) => existsSync(join(at, path.replace(/\.tsx?$/u, one)))))
    .toSorted()
    .map((path) => `${path} has no specification beside it`);
}

/**
 * Matches a specifier that opens with a scheme, which names something other than a package.
 *
 * @remarks
 *   `node:path` is a builtin and `virtual:i18n` is a module a bundler plugin answers. Neither is
 *   installed, so neither is a manifest's to declare. A scoped package opens with `@` and a package
 *   name carries no colon, so nothing installed matches this.
 */
const SCHEME = /^[a-z][a-z\d+.-]*:/u;

/**
 * Reads the package a specifier names, or nothing where it names a file, a builtin or a virtual
 * module.
 *
 * @remarks
 *   A subpath is dropped, so `@acme/theme/authoring` reads as `@acme/theme`, because a manifest
 *   declares the package and not the entry a file reached it through.
 */
function packageOf(specifier: string): string | undefined {
  if (specifier.startsWith(".") || specifier.startsWith("#") || SCHEME.test(specifier)) {
    return undefined;
  }

  const parts = specifier.split("/");

  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

/**
 * Reports every package a source imports that the manifest does not declare.
 *
 * @remarks
 *   A source runs in whatever installed the package, so what it imports has to be a dependency or
 *   a peer. A specification is read past, because it runs in the workspace and resolves the
 *   testing kits through the root. Neither `publint` nor `attw` reads an import, so a package
 *   importing something it never declared installs and then fails at run time.
 * @param at - The directory holding the package's manifest.
 * @param published - The parsed manifest.
 * @returns One violation per undeclared package, naming the file that imports it.
 */
export function declared(at: string, published: Published): readonly string[] {
  const allowed = new Set([
    ...Object.keys(published.dependencies ?? {}),
    ...Object.keys(published.peerDependencies ?? {}),
  ]);
  const found = globSync(SOURCES, { cwd: at }).filter((path) => named(path, true));

  return found
    .flatMap((path) => {
      const held = readFileSync(join(at, path), "utf8");

      return SPECIFIERS.flatMap((pattern) =>
        Array.from(held.matchAll(pattern)).flatMap((match) => match.slice(1)),
      )
        .map((specifier) => packageOf(specifier))
        .filter((name) => name !== undefined && !allowed.has(name))
        .map((name) => `${path} imports ${String(name)}, which the manifest does not declare`);
    })
    .toSorted();
}

/**
 * Reports every file suffixed `.tsx` that writes no JSX.
 *
 * @remarks
 *   A file is named for what it holds, and a suffix that promises JSX where there is none sends a
 *   reader looking for markup that was never written. The other way round needs no check, because
 *   a compiler refuses JSX in a `.ts` file.
 * @param at - The directory holding the package's manifest.
 * @returns One violation per file, or an empty array.
 */
export function jsx(at: string): readonly string[] {
  return globSync(SOURCES, { cwd: at })
    .filter((path) => path.endsWith(".tsx") && !TAGS.test(readFileSync(join(at, path), "utf8")))
    .toSorted()
    .map((path) => `${path} writes no JSX, so its suffix is ts`);
}
