/**
 * What a specification that draws its own fixtures is excused.
 */

import { type Contribution, lint, named } from "@stealthscale/vite-config";

import { RENDERED } from "#lint/rendered.ts";

/**
 * Lets a rendered specification declare more than one component.
 *
 * The rule keeps a component library navigable, where a file is found by the component it
 * declares. A specification's components are fixtures rather than library components: they are
 * read beside the test that drives them, and splitting each into a file of its own puts the
 * fixture further from the assertion it exists for.
 *
 * @returns The contribution.
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
