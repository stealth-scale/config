/**
 * Rewrites the lines of a generated runtime that write a class name, so the browser writes the
 * scheme the stylesheet was renamed to.
 *
 * @remarks
 *   The compiler emits the runtime from templates and offers no hook into the names, so each
 *   template line is matched as the installed compiler writes it and replaced with a call into the
 *   naming package. Every atomic class passes `toClass` in `helpers`. Every variant class passes
 *   `transform` in the recipe runtime before it reaches the same `toClass`, and every compound
 *   class passes `formatClassName` there. A compiler release that moves a line fails the rewrite,
 *   which is the version pin.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The package the rewritten runtime imports the scheme from.
 */
const NAMING = "@stealthscale/pandacss-naming";

/**
 * Lists the extensions codegen writes the runtime under, the house's first.
 */
const EXTENSIONS = ["mjs", "js"];

/**
 * Describes one line to find once and what to write in its place.
 */
interface Edit {
  /**
   * The line as the compiler emits it. The recipe runtime's variant line carries the configured
   * separator, so each anchor is a pattern rather than a string.
   */
  anchor: RegExp;
  /**
   * The line as a person reads it, for the error a moved line raises.
   */
  line: string;
  /**
   * The line to write in its place.
   */
  replacement: string;
}

/**
 * Describes one generated file to rewrite: what it imports from the naming package and which of
 * its lines are replaced.
 */
interface Rewrite {
  /**
   * The edits, applied in order.
   */
  edits: readonly Edit[];
  /**
   * The file's path under the runtime directory, without its extension.
   */
  file: string;
  /**
   * The names the rewritten file imports from the naming package.
   */
  names: readonly string[];
}

/**
 * Rewrites `helpers`: the joined class goes through the scheme, and an empty name, which is a
 * boolean axis at `false`, is not added to the element's classes.
 */
const HELPERS: Rewrite = {
  edits: [
    {
      anchor: /parts\.join\(":"\)/gu,
      line: 'parts.join(":")',
      replacement: 'atomicClass(parts.join(":"))',
    },
    {
      anchor: /set\.add\(name\)/gu,
      line: "set.add(name)",
      replacement: 'if (name !== "") set.add(name)',
    },
  ],
  file: "helpers",
  names: ["atomicClass"],
};

/**
 * Rewrites the recipe runtime: the variant class is written by the scheme, and a compound's class
 * goes through the scheme as the stylesheet's does.
 */
const RECIPES: Rewrite = {
  edits: [
    {
      anchor: /`\$\{className\}--\$\{prop\}[-_=]\$\{withoutSpace\(value\)\}`/gu,
      line: "`${className}--${prop}<separator>${withoutSpace(value)}`",
      replacement: "variantClass(className, prop, value)",
    },
    {
      anchor: /return classPrefix \? `\$\{classPrefix\}-\$\{next\}` : next/gu,
      line: "return classPrefix ? `${classPrefix}-${next}` : next",
      replacement: "return atomicClass(classPrefix ? `${classPrefix}-${next}` : next)",
    },
  ],
  file: join("recipes", "runtime"),
  names: ["atomicClass", "variantClass"],
};

/**
 * Writes the import a rewritten file opens with, which also marks the file as rewritten.
 */
function header(names: readonly string[]): string {
  return `import { ${names.join(", ")} } from "${NAMING}";\n`;
}

/**
 * Applies one edit to a file's text.
 *
 * @remarks
 *   The replacement is given as a function, so a `$` in it is written as it is rather than read
 *   as a substitution pattern.
 * @throws {@link Error} When the anchor is absent from the text or appears more than once.
 */
function applied(file: string, text: string, edit: Edit): string {
  const found = text.match(edit.anchor)?.length ?? 0;

  if (found !== 1) {
    throw new Error(
      `${file} contains ${edit.line} ${String(found)} times where the rewrite needs it once`,
    );
  }

  return text.replaceAll(edit.anchor, () => edit.replacement);
}

/**
 * Rewrites one file, and leaves a file the rewrite was already applied to as it is.
 */
function rewrite(dir: string, extension: string, rewriting: Rewrite): void {
  const file = join(dir, `${rewriting.file}.${extension}`);
  const source = readFileSync(file, "utf8");
  const opening = header(rewriting.names);

  if (source.startsWith(opening)) return;

  writeFileSync(
    file,
    `${opening}${rewriting.edits.reduce((text, edit) => applied(file, text, edit), source)}`,
  );
}

/**
 * Rewrites the generated runtime under a directory so the browser writes the scheme.
 *
 * @remarks
 *   The runtime is read under its `mjs` extension, or under `js` where the compiler was configured
 *   for that. A second run on a rewritten runtime changes nothing.
 * @param dir - The directory codegen wrote the runtime into, holding `helpers` and
 *   `recipes/runtime`.
 * @throws {@link Error} When the directory contains no runtime, or a template line is not found
 *   once in its file.
 */
export function rewriteRuntime(dir: string): void {
  const extension = EXTENSIONS.find((each) => existsSync(join(dir, `helpers.${each}`)));

  if (extension === undefined) {
    throw new Error(`${dir} contains no generated runtime: neither helpers.mjs nor helpers.js`);
  }

  rewrite(dir, extension, HELPERS);
  rewrite(dir, extension, RECIPES);
}
