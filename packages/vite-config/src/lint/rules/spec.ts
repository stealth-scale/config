/**
 * How a specification is written, as rules a linter can check.
 *
 * A specification states behaviour as named cases. `describe` names the subject once and each `it`
 * states one case, so the two read together as one sentence: "layer sets kind on every layer". The
 * rules here hold that shape and the grammar of both titles. Whether the cases cover the branches
 * is not checkable, and `docs/standards/test-names.md` states it instead.
 */

import vitest from "@vitest/eslint-plugin";

import { type PluginRules } from "#lint/rules/rules.ts";

/**
 * The name the plugin's rules are addressed by.
 *
 * Oxlint carries a `vitest` implementation of its own and reserves the name, so the plugin from npm
 * loads under a second one. The same split `jsdoc-js` already loads under.
 */
const ALIAS = "vitest-js";

/**
 * The grammar of a subject's title.
 *
 * The subject is the thing under test, so its title is that thing's name and nothing else. A title
 * carrying a space is a sentence about the subject rather than the subject, which leaves the case
 * titles beneath it with no sentence to complete.
 */
const SUBJECT_TITLE = [
  String.raw`^\S+$`,
  "a describe title is the name of the thing under test and nothing else, so that each it() beneath it completes a sentence",
];

/**
 * The grammar of a case's title.
 *
 * Lower case because the sentence opens with the subject rather than here, and comma-free because
 * the clause after a comma is the reason the case exists rather than a second thing it checks.
 */
const CASE_TITLE = [
  String.raw`^[a-z][^,]*$`,
  "an it() title opens on a third-person verb in lower case and carries no comma: the clause after a comma is why the case exists, which belongs in the docblock of the thing under test",
];

/**
 * The opener that restates what the runner has already said.
 */
const NO_SHOULD = [
  String.raw`^should\b`,
  "drop `should`: the third-person verb reads as a sentence without it",
];

/**
 * The words that claim an assertion instead of describing one.
 */
const HOLLOW = ["correctly", "properly", "works"];

/**
 * What a specification is named.
 *
 * The plugin looks for `.test.`, which is one of the two spellings vitest collects. A package here
 * writes one specification per source file, named after it, so the two sit side by side.
 */
const SPEC_FILENAME = String.raw`.*\.spec\.[tj]sx?$`;

/**
 * When a case states how many assertions it makes.
 *
 * Only where an assertion sits inside a callback, which is the case the count exists for: a
 * callback that never runs takes its assertions with it, and the case passes having checked
 * nothing.
 *
 * A loop is not that case. `onlyFunctionsWithExpectInLoop` reports a `for` over a constant array,
 * which always runs, and a count written there is a second number to keep true. A case asserting in
 * its own body cannot fail this way either.
 */
const COUNTED_WHERE_DEFERRED = { onlyFunctionsWithExpectInCallback: true };

/**
 * Every rule the plugin publishes, each one an error.
 *
 * `configs.all` states them as warnings and turns five off, each of those five being one side of a
 * pair whose other side contradicts it. A warning does not fail `vp check`, so a rule stated as one
 * is a rule that does not run. The five stay off.
 *
 * Read from the plugin rather than listed here, so a rule an upgrade adds is on without anybody
 * noticing that it exists.
 *
 * @returns Every published rule, renamed to the alias and raised to an error.
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
 * The specification standard, rule by rule.
 *
 * Everything the plugin publishes, and then the decisions its defaults cannot make. A case is
 * written `it` and sits under the one `describe` that names the subject. A case whose body branches
 * is two cases, because the branch decides at run time which behaviour is checked, so neither is
 * named and the coverage reported belongs to whichever side the input took.
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
