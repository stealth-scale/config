import { readFileSync } from "node:fs";
import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { style } from "#fmt/style.ts";

/**
 * The section of `.editorconfig` every file falls under.
 */
const EVERY = "*";

/**
 * The section a quote style belongs to, since a quote is only a choice in code.
 */
const CODE = "*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}";

/**
 * The section prose falls under, which the formatter rewraps.
 */
const PROSE = "*.{md,mdx,yml,yaml}";

/**
 * The section a written file falls under, which nothing should tidy.
 */
const WRITTEN = "{*.gen.*,pnpm-lock.yaml}";

/**
 * What an editor is told, read off the file the repository ships.
 *
 * @returns Each section against the settings stated under it.
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
 * Reads the measurements the preset sets.
 *
 * @returns Those measurements.
 */
function settings(): NonNullable<UserConfig["fmt"]> {
  return (style().config as UserConfig).fmt as NonNullable<UserConfig["fmt"]>;
}

test("writes to a hundred columns, which is what the docblocks and the prose wrap to", () => {
  expect(settings().printWidth).toBe(100);
});

test("indents with two spaces rather than a tab", () => {
  expect(settings().tabWidth).toBe(2);
  expect(settings().useTabs).toBe(false);
});

test("quotes with double quotes, and ends every file with a newline", () => {
  expect(settings().singleQuote).toBe(false);
  expect(settings().insertFinalNewline).toBe(true);
});

test("ends a line the one way, whatever the machine would have done", () => {
  expect(settings().endOfLine).toBe("lf");
});

test("tells an editor the same width and indent the formatter writes", () => {
  const held = editor()[EVERY];

  expect(held?.["max_line_length"]).toBe(String(settings().printWidth));
  expect(held?.["indent_size"]).toBe(String(settings().tabWidth));
  expect(held?.["indent_style"]).toBe(settings().useTabs === true ? "tab" : "space");
});

test("tells an editor the same line ending and final newline the formatter writes", () => {
  const held = editor()[EVERY];

  expect(held?.["end_of_line"]).toBe(settings().endOfLine);
  expect(held?.["insert_final_newline"]).toBe(String(settings().insertFinalNewline));
});

test("tells an editor the same quote, in the section where a quote is a choice", () => {
  expect(editor()[CODE]?.["quote_type"]).toBe(
    settings().singleQuote === true ? "single" : "double",
  );
});

test("wraps prose to that width too, since the formatter rewraps it", () => {
  expect(editor()[PROSE]?.["max_line_length"]).toBe(String(settings().printWidth));
});

test("leaves a written file alone in the editor as well as in the formatter", () => {
  const held = editor()[WRITTEN];

  expect(held?.["trim_trailing_whitespace"]).toBe("unset");
  expect(held?.["insert_final_newline"]).toBe("unset");
});
