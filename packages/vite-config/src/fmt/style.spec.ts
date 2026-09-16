/**
 * Checks the house whitespace, and that the editor is told the same thing.
 */

import { readFileSync } from "node:fs";
import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { style } from "#fmt/style.ts";

/**
 * The editorconfig section that applies to every file.
 */
const EVERY = "*";

/**
 * The section naming the files a quote style applies to.
 */
const CODE = "*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}";

/**
 * The section naming the files written as prose.
 */
const PROSE = "*.{md,mdx,yml,yaml}";

/**
 * The section naming the files no editor is allowed to tidy.
 */
const WRITTEN = "{*.gen.*,pnpm-lock.yaml}";

/**
 * Parses the repository's editorconfig into sections and their settings.
 *
 * @remarks
 *   The parser handles the subset this file asserts on: a section header, a
 *   comment, and a key on one line. An editorconfig using anything else would
 *   be read as fewer settings rather than reported as unreadable.
 */
function editor(): Record<string, Record<string, string>> {
  const source = readFileSync(
    new URL("../../../../.editorconfig", import.meta.url).pathname,
    "utf8",
  );
  const held: Record<string, Record<string, string>> = {};
  let section = "";

  for (const line of source.split("\n")) {
    const stated = line.trim();
    const at = stated.indexOf("=");

    if (stated.startsWith("[") && stated.endsWith("]")) {
      section = stated.slice(1, -1);
      held[section] = {};
    } else if (!stated.startsWith("#") && at > 0) {
      (held[section] ??= {})[stated.slice(0, at).trim()] = stated.slice(at + 1).trim();
    }
  }

  return held;
}

/**
 * Takes the formatting block the layer states.
 */
function settings(): NonNullable<UserConfig["fmt"]> {
  return (style().config as UserConfig).fmt as NonNullable<UserConfig["fmt"]>;
}

describe("style", () => {
  it("writes to a hundred columns", () => {
    expect(settings().printWidth).toBe(100);
  });

  it("leaves a docblock that already fits alone", () => {
    expect(settings().jsdoc).toStrictEqual({ lineWrappingStyle: "balance" });
  });

  it("indents with two spaces rather than a tab", () => {
    expect(settings().tabWidth).toBe(2);
    expect(settings().useTabs).toBe(false);
  });

  it("quotes with double quotes and ends every file with a newline", () => {
    expect(settings().singleQuote).toBe(false);
    expect(settings().insertFinalNewline).toBe(true);
  });

  it("ends every line the same way", () => {
    expect(settings().endOfLine).toBe("lf");
  });

  it("tells an editor the same width and indent the formatter writes", () => {
    const held = editor()[EVERY];

    expect(held?.["max_line_length"]).toBe(String(settings().printWidth));
    expect(held?.["indent_size"]).toBe(String(settings().tabWidth));
    expect(held?.["indent_style"]).toBe(settings().useTabs === true ? "tab" : "space");
  });

  it("tells an editor the same line ending and final newline the formatter writes", () => {
    const held = editor()[EVERY];

    expect(held?.["end_of_line"]).toBe(settings().endOfLine);
    expect(held?.["insert_final_newline"]).toBe(String(settings().insertFinalNewline));
  });

  it("tells an editor the same quote", () => {
    expect(editor()[CODE]?.["quote_type"]).toBe(
      settings().singleQuote === true ? "single" : "double",
    );
  });

  it("wraps prose to the same width", () => {
    expect(editor()[PROSE]?.["max_line_length"]).toBe(String(settings().printWidth));
  });

  it("leaves a written file alone in the editor as well as in the formatter", () => {
    const held = editor()[WRITTEN];

    expect(held?.["trim_trailing_whitespace"]).toBe("unset");
    expect(held?.["insert_final_newline"]).toBe("unset");
  });
});
