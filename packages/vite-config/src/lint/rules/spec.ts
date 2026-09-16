/**
 * Configures the vitest rules that make a specification its own documentation.
 *
 * @remarks
 *   A specification carries no doc comments, so its titles have to carry the
 *   same information. Each pattern is stated with a sentence beside it, and the
 *   linter prints that sentence rather than the regular expression.
 */

import vitest from "@vitest/eslint-plugin";

import { type PluginRules } from "#lint/rules/rules.ts";

/**
 * The prefix this configuration loads the vitest plugin's rules under.
 */
const ALIAS = "vitest-js";

/**
 * Requires a describe title to be one unbroken word, and says why.
 *
 * @remarks
 *   The pattern refuses whitespace and nothing else, so an identifier, a
 *   package name and a file name all pass. A title written as a phrase fails,
 *   because the case titles underneath it are what finish the sentence.
 */
const SUBJECT_TITLE = [
  String.raw`^\S+$`,
  "a describe title is the name of the thing under test and nothing else, so that each it() beneath it completes a sentence",
];

/**
 * Requires a case title to open on a lower-case word and carry no comma.
 *
 * @remarks
 *   The clause after a comma is why a case exists, and that belongs in the doc
 *   comment above the thing under test. A title states what is checked, and the
 *   describe title above it supplies the subject.
 */
const CASE_TITLE = [
  String.raw`^[a-z][^,]*$`,
  "an it() title opens on a third-person verb in lower case and carries no comma: the clause after a comma is why the case exists, which belongs in the docblock of the thing under test",
];

/**
 * Turns away a case title that opens on the word `should`.
 *
 * @remarks
 *   The pattern is anchored, so `should` anywhere later in a title is left
 *   alone. A third-person verb already reads as a sentence, and the word only
 *   moves the claim one step further from what the case asserts.
 */
const NO_SHOULD = [
  String.raw`^should\b`,
  "drop `should`: the third-person verb reads as a sentence without it",
];

/**
 * The words a title reaches for when it has not said what is being checked.
 */
const HOLLOW = ["correctly", "properly", "works"];

/**
 * The name every specification file has to match.
 */
const SPEC_FILENAME = String.raw`.*\.spec\.[tj]sx?$`;

/**
 * Asks for a declared assertion count only where a callback holds an expect.
 *
 * @remarks
 *   A hook and a helper are left alone by this. Without it, every callback in
 *   the file would be asked to declare a count it has no assertions to reach.
 */
const COUNTED_WHERE_DEFERRED = { onlyFunctionsWithExpectInCallback: true };

/**
 * Rewrites the plugin's whole published rule list into two severities.
 *
 * @remarks
 *   A rule the plugin ships off stays off, and every other one becomes an
 *   error, so a rule added in a later release arrives already denied. Each name
 *   is moved from the plugin's own prefix onto the alias it is loaded under
 *   here.
 */
function published(): PluginRules {
  const stated = Object.entries(vitest.configs.all.rules);

  return Object.fromEntries(
    stated.map(([rule, severity]) => [
      rule.replace(/^vitest\//u, `${ALIAS}/`),
      severity === "off" ? "off" : "error",
    ]),
  );
}

/**
 * Applies every vitest rule, then states the house position on nine of them.
 *
 * @remarks
 *   The entries written after the spread win, so a rule needing different
 *   options is reconfigured in place rather than appearing twice. Two of the
 *   nine are turned back off, because both would report on a specification this
 *   house considers well written.
 */
export const SPEC: PluginRules = {
  ...published(),
  [`${ALIAS}/consistent-test-filename`]: ["error", { pattern: SPEC_FILENAME }],
  [`${ALIAS}/consistent-test-it`]: ["error", { fn: "it", withinDescribe: "it" }],
  [`${ALIAS}/max-expects`]: ["error", { max: 10 }],
  [`${ALIAS}/max-nested-describe`]: ["error", { max: 1 }],
  [`${ALIAS}/prefer-describe-function-title`]: "off",
  [`${ALIAS}/prefer-expect-assertions`]: ["error", COUNTED_WHERE_DEFERRED],
  [`${ALIAS}/prefer-lowercase-title`]: ["error", { ignore: ["describe"] }],
  [`${ALIAS}/prefer-strict-boolean-matchers`]: "off",
  [`${ALIAS}/valid-title`]: [
    "error",
    {
      disallowedWords: HOLLOW,
      mustMatch: { describe: SUBJECT_TITLE, it: CASE_TITLE },
      mustNotMatch: { it: NO_SHOULD },
    },
  ],
};
