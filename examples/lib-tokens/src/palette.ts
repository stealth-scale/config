/**
 * Defines the design tokens and turns them into the stylesheet the package ships.
 *
 * @remarks
 *   The tokens live here as data rather than in a `.css` file, so the build can
 *   both write the stylesheet and hand the same values to TypeScript. One
 *   definition then feeds a consumer that reads a custom property and one that
 *   reads a string.
 */

/**
 * Every custom property the stylesheet declares, keyed by its own name.
 */
export const PALETTE: Readonly<Record<string, string>> = {
  "--ink": "#1a1a1a",
  "--paper": "#fdfdfd",
  "--rule": "#d4d4d4",
};

/**
 * Maps the subpath a consumer imports onto the file the build leaves behind.
 *
 * @remarks
 *   The build writes the stylesheet and the manifest advertises it, and both
 *   read this map. Stating the pair once means a renamed output cannot leave
 *   the export map pointing at a file that is no longer written.
 */
export const TOKEN_EXPORTS: Readonly<Record<string, string>> = {
  "./tokens.css": "./dist/tokens.css",
};

/**
 * Writes the palette out as a `:root` rule a browser can load.
 *
 * @remarks
 *   The declarations land on `:root` so a custom property is inherited by every
 *   element and a consumer can override one on a narrower selector. Nothing is
 *   escaped, so a token name or colour holding a brace produces a stylesheet
 *   that does not parse.
 * @returns The rule as CSS text, ending in a newline.
 */
export function stylesheet(): string {
  const rules = Object.entries(PALETTE).map(([token, colour]) => `  ${token}: ${colour};`);

  return `:root {\n${rules.join("\n")}\n}\n`;
}
