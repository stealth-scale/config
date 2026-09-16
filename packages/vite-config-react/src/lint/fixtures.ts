/**
 * Lets a rendering specification declare every component it drives in one file.
 */

import { type Contribution, lint, named } from "@stealthscale/vite-config";

import { RENDERED } from "#lint/rendered.ts";

/**
 * Lifts the one-component-per-file limit from a specification and its fixtures.
 *
 * @remarks
 *   The limit exists so fast refresh can replace a module and keep state, and neither applies to a
 *   file the runner imports once. Splitting a fixture out into a file of its own would separate it
 *   from the assertion that explains what it is for.
 */
export function fixtures(): Contribution {
  return named(
    "react.lint.fixtures",
    lint.relax({
      because: "a specification's components are fixtures, read beside the test that drives them",
      files: RENDERED,
      rules: { "react/no-multi-comp": "off" },
    }),
  );
}
