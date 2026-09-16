/**
 * Drops the one React rule the automatic JSX runtime makes obsolete.
 */

import { type Contribution, lint, named } from "@stealthscale/vite-config";

/**
 * The files the relaxation covers, matching the set the React rules are declared over.
 */
const FILES = ["**/*.{ts,tsx}"];

/**
 * Stops the linter asking for a React import that no file needs.
 *
 * @remarks
 *   The transform and the shipped `web.json` both select the automatic runtime, which imports the
 *   factory for a file instead of reading it from scope. A package compiling with the classic
 *   runtime has to put the rule back, because nothing else warns about the import it still needs.
 */
export function runtime(): Contribution {
  return named(
    "react.lint.runtime",
    lint.relax({
      because: "the automatic JSX runtime imports React itself, so nothing has it in scope",
      files: FILES,
      rules: { "react/react-in-jsx-scope": "off" },
    }),
  );
}
