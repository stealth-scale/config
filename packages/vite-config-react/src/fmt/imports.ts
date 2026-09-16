/**
 * Gives React its own group in the import order the formatter writes.
 */

import { fmt, named, type Override } from "@stealthscale/vite-config";

/**
 * The specifiers that sort into the React group, subpaths included.
 */
const REACT = ["react", "react-dom", "react-dom/*", "react/*"];

/**
 * Sorts React and its renderer into a group of their own, ahead of every other group.
 *
 * @remarks
 *   The group goes to the front of the order a tier already declared, so a reader opening a file
 *   that renders sees the framework before the dependencies built on it. A configuration that
 *   sorts no imports at all fails when this layer resolves rather than when it is built.
 */
export function imports(): Override {
  return named(
    "react.fmt.imports",
    fmt.group({
      because: "a file that renders is about rendering, so its framework reads first",
      name: "react",
      patterns: REACT,
    }),
  );
}
