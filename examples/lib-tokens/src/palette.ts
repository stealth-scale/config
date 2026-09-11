/**
 * The colours this library defines, and what it writes them out as.
 */

/**
 * Each token against the colour it stands for.
 *
 * The one place the values are written. Everything this package ships is worked out from here, so
 * adding a colour is one edit rather than one edit and a stylesheet somebody has to remember.
 */
export const PALETTE: Readonly<Record<string, string>> = {
  "--ink": "#1a1a1a",
  "--paper": "#fdfdfd",
  "--rule": "#d4d4d4",
};

/**
 * The subpaths this package publishes beyond what the packer builds.
 *
 * Named here rather than in the config, because this module is what decides that the stylesheet
 * exists and what it is called. A second copy in the config would be a list to keep in step, and
 * the failure when it drifted would be a subpath pointing at a file nothing writes any more.
 */
export const TOKEN_EXPORTS: Readonly<Record<string, string>> = {
  "./tokens.css": "./dist/tokens.css",
};

/**
 * Writes the palette as a stylesheet, which no bundler would produce.
 *
 * A custom property is not a module and cannot be imported, so the values have to reach a browser
 * as text. Generating it from the same object the types come from is what keeps the stylesheet and
 * the module saying the same thing.
 *
 * @returns The text a browser reads the colours from.
 */
export function stylesheet(): string {
  const rules = Object.entries(PALETTE).map(([token, colour]) => `  ${token}: ${colour};`);

  return `:root {\n${rules.join("\n")}\n}\n`;
}
