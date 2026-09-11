/**
 * Where a rendering file's framework imports sit.
 */

import { fmt, type Override } from "@stealthscale/vite-config";

/**
 * The modules that are React rather than a dependency that happens to be installed.
 */
const REACT = ["react", "react-dom", "react-dom/*", "react/*"];

/**
 * Puts React at the top of every file that renders.
 *
 * A file that renders is about rendering, so the framework reads first and everything else follows
 * it. The toolchain cannot state this on its own behalf: it would have to name React to do so, and
 * a configuration that names one framework is one no other framework can be added beside.
 *
 * @returns The override.
 */
export function imports(): Override {
  return fmt.group({
    because: "a file that renders is about rendering, so its framework reads first",
    name: "react",
    patterns: REACT,
  });
}
