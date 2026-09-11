/**
 * The rules the automatic JSX runtime makes obsolete.
 */

import { type Contribution, lint } from "@stealthscale/config-vite";

/**
 * The files the automatic runtime compiles, which is everything this package renders.
 */
const FILES = ["**/*.{ts,tsx}"];

/**
 * Stops asking for what the compiler now supplies.
 *
 * The tsconfig this package ships sets the automatic JSX runtime, so a file that renders imports
 * `react/jsx-runtime` without saying so and never needs `React` in scope. The rule that checks for
 * it predates that runtime and fires on every correct file.
 *
 * Paired with the tsconfig deliberately. A repository compiling with the classic runtime instead
 * takes this back by name, and gets the rule that catches its real mistake.
 *
 * @returns The contribution.
 */
export function runtime(): Contribution {
  return lint.relax({
    because: "the automatic JSX runtime imports React itself, so nothing has it in scope",
    files: FILES,
    rules: { "react/react-in-jsx-scope": "off" },
  });
}
