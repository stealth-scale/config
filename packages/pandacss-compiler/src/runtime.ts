/**
 * Rewrites the lines of a generated runtime that write a class name or an attribute of the
 * compiler's own, so the browser writes the scheme the stylesheet was renamed to and nothing else.
 *
 * @remarks
 *   The compiler emits the runtime from templates and offers no hook into the names, so each
 *   template line is matched as the installed compiler writes it and replaced with a call into the
 *   naming package. Every atomic class passes `toClass` in `helpers`. Every variant class passes
 *   `transform` in the recipe runtime before it reaches the same `toClass`, and every compound
 *   class passes `formatClassName` there. The slot binding writes `data-slot` on every part, which
 *   the part's slot class already says, and that line is dropped. A compiler release that moves a
 *   line fails the rewrite, which is the version pin.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { type Separator } from "@stealthscale/pandacss-naming";

/**
 * The package the rewritten runtime imports the scheme from.
 */
const NAMING = "@stealthscale/pandacss-naming";

/**
 * Lists the extensions codegen writes the runtime under, the house's first.
 */
const EXTENSIONS = ["mjs", "js"];

/**
 * Marks where a replacement takes the separator the compiler was configured with, as a literal.
 */
const MARK = "<separator>";

/**
 * Opens a rewritten file that imports nothing, so a second run recognises it.
 */
const REWRITTEN = "// rewritten by @stealthscale/pandacss-compiler\n";

/**
 * Matches the directive a generated JSX file opens with, which has to stay its first line.
 */
const DIRECTIVE = /^"use client";\n/u;

/**
 * The directory codegen writes the JSX bindings into, present only where the compiler was
 * configured with a JSX framework.
 */
const JSX = "jsx";

/**
 * Describes one line to find a fixed number of times and what to write in its place.
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
   * The line to write in its place, with the separator's mark where the scheme reads it.
   */
  replacement: string;
  /**
   * How many times the anchor is found where the rewrite needs it. One unless stated.
   */
  times?: number | undefined;
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
   * The names the rewritten file imports from the naming package, or none.
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
      replacement: `atomicClass(parts.join(":"), ${MARK})`,
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
      replacement: `return atomicClass(classPrefix ? \`\${classPrefix}-\${next}\` : next, ${MARK})`,
    },
  ],
  file: join("recipes", "runtime"),
  names: ["atomicClass", "variantClass"],
};

/**
 * Rewrites the slot binding: the line that writes `data-slot` on a part is dropped, once in the
 * provider and once in the part, because the slot class already names the slot.
 */
const SLOTS: Rewrite = {
  edits: [
    {
      anchor: /'data-slot': slot,\n\s*/gu,
      line: "'data-slot': slot,",
      replacement: "",
      times: 2,
    },
  ],
  file: join("jsx", "create-slot-recipe-context"),
  names: [],
};

/**
 * Writes the line a rewritten file opens with, which also marks the file as rewritten: the import
 * of what it uses from the scheme, or a comment where it uses nothing.
 */
function header(names: readonly string[]): string {
  return names.length === 0 ? REWRITTEN : `import { ${names.join(", ")} } from "${NAMING}";\n`;
}

/**
 * Writes how many times an anchor is expected, as the error a moved line raises reads it.
 */
function expected(times: number): string {
  return times === 1 ? "once" : `${String(times)} times`;
}

/**
 * Applies one edit to a file's text, with the separator written as a literal.
 *
 * @remarks
 *   The replacement is given as a function, so a `$` in it is written as it is rather than read
 *   as a substitution pattern.
 * @throws {@link Error} When the anchor is found any number of times but the one the edit
 * states.
 */
function applied(file: string, text: string, edit: Edit, separator: Separator): string {
  const found = text.match(edit.anchor)?.length ?? 0;
  const times = edit.times ?? 1;

  if (found !== times) {
    throw new Error(
      `${file} contains ${edit.line} ${String(found)} times where the rewrite needs it ${expected(times)}`,
    );
  }

  const replacement = edit.replacement.replaceAll(MARK, JSON.stringify(separator));

  return text.replaceAll(edit.anchor, () => replacement);
}

/**
 * Rewrites one file, and leaves a file the rewrite was already applied to as it is.
 *
 * @remarks
 *   The header goes after the `"use client"` directive where the file opens with one, because a
 *   directive counts only as the first statement of a module.
 */
function rewrite(file: string, rewriting: Rewrite, separator: Separator): void {
  const source = readFileSync(file, "utf8");
  const opening = header(rewriting.names);
  const directive = DIRECTIVE.exec(source)?.[0] ?? "";
  const body = source.slice(directive.length);

  if (body.startsWith(opening)) return;

  writeFileSync(
    file,
    `${directive}${opening}${rewriting.edits.reduce((text, edit) => applied(file, text, edit, separator), body)}`,
  );
}

/**
 * Rewrites the generated runtime under a directory so the browser writes the scheme.
 *
 * @remarks
 *   The runtime is read under its `mjs` extension, or under `js` where the compiler was configured
 *   for that. The slot binding is rewritten where the runtime has a `jsx` directory, which it has
 *   only where the compiler was configured with a JSX framework. A second run on a rewritten
 *   runtime changes nothing.
 * @param dir - The directory codegen wrote the runtime into, holding `helpers`, `recipes/runtime`
 *   and, with a JSX framework, `jsx/create-slot-recipe-context`.
 * @param separator - The separator the compiler was configured with, which the scheme reads at
 *   run time.
 * @throws {@link Error} When the directory contains no runtime, or a template line is not found
 *   in its file as many times as the rewrite needs it.
 */
export function rewriteRuntime(dir: string, separator: Separator): void {
  const extension = EXTENSIONS.find((each) => existsSync(join(dir, `helpers.${each}`)));

  if (extension === undefined) {
    throw new Error(`${dir} contains no generated runtime: neither helpers.mjs nor helpers.js`);
  }

  rewrite(join(dir, `${HELPERS.file}.${extension}`), HELPERS, separator);
  rewrite(join(dir, `${RECIPES.file}.${extension}`), RECIPES, separator);
  if (existsSync(join(dir, JSX)))
    rewrite(join(dir, `${SLOTS.file}.${extension}`), SLOTS, separator);
}
