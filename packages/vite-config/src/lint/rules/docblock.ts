/**
 * Configures the two plugins that read a doc comment.
 *
 * @remarks
 *   No rule here requires a tag into existence. The plugin asks for a block on
 *   every declaration and then checks the text of whichever tags the author
 *   wrote, and `@throws` is the single exception, because a signature has
 *   nowhere to record what a function throws.
 */

import { type PluginRules } from "#lint/rules/rules.ts";

/**
 * The tags a block may carry, in the order a block writes them.
 *
 * @remarks
 *   One list serves two rules. It fixes the order the tags are sorted into, and
 *   it names the tags whose bodies the indentation check leaves alone.
 */
const TAG_ORDER = [
  "remarks",
  "typeParam",
  "param",
  "returns",
  "throws",
  "example",
  "see",
  "deprecated",
  "packageDocumentation",
];

/**
 * Matches a tag body that does not open on a word carrying no information.
 *
 * @remarks
 *   The lookahead is anchored at the start and consumes nothing, so it reads
 *   the first word and accepts every other opening. A body describing what a
 *   parameter is passes, and one opening `What the caller passed` does not.
 */
const NO_VAGUE_OPENER = String.raw`^(?!(?:What|Whatever|Something|Anything|Stuff)\b)`;

/**
 * Matches a summary that does not open on a generic verb stamped onto a noun.
 *
 * @remarks
 *   `Holds`, `Names` and `States` describe any declaration equally well, so a
 *   summary opening on one of them has not said what this declaration does. A
 *   noun phrase still passes, because a constant and a type alias are both
 *   allowed to take one.
 */
const NO_GENERIC_OPENER = String.raw`^(?!(?:What|Whatever|Something|Anything|Stuff|Holds|Names|States)\b)`;

/**
 * Selects the declarations that need a block beyond those the rule covers itself.
 *
 * @remarks
 *   A type, an interface member and a module-level constant are each reached by
 *   selector, since the rule's own `require` map lists functions and classes
 *   only. An arrow function is reached through the declarator it is assigned
 *   to, which is why it appears as a pair rather than on its own.
 */
const DOCUMENTED = [
  "TSInterfaceDeclaration",
  "TSTypeAliasDeclaration",
  "TSPropertySignature",
  "TSMethodSignature",
  "TSDeclareFunction",
  "PropertyDefinition",
  "Program > VariableDeclaration",
  'ExportNamedDeclaration[declaration.type="VariableDeclaration"]',
  "VariableDeclarator > ArrowFunctionExpression",
];

/**
 * Reaches every declaration whose summary is read, for a rule taking `contexts`.
 *
 * @remarks
 *   A rule given `contexts` checks those nodes instead of its own defaults, so a
 *   function drops out of the check unless it is named here. {@link DOCUMENTED}
 *   leaves functions to the `require` map of `require-jsdoc`, which takes no
 *   `contexts` of its own for them.
 */
const SUMMARISED = [
  ...DOCUMENTED,
  "ClassDeclaration",
  "ClassExpression",
  "FunctionDeclaration",
  "FunctionExpression",
  "MethodDefinition",
];

/**
 * Counts a destructured parameter once rather than once per property.
 *
 * @remarks
 *   A function taking an options object documents the object, and each property
 *   is documented where the type declares it. Without this, the same
 *   descriptions would be asked for twice.
 */
const ONE_PARAM_PER_OBJECT = { checkDestructured: false };

/**
 * Maps each JSDoc tag name onto the TSDoc name that stands in for it.
 *
 * @remarks
 *   The plugin reports the JSDoc spelling and names its replacement in the
 *   message. Both `@file` and `@fileoverview` land on `@packageDocumentation`,
 *   which a documentation site reads as the entry point's own description.
 */
export const TSDOC_TAGS = {
  default: "defaultValue",
  file: "packageDocumentation",
  fileoverview: "packageDocumentation",
  return: "returns",
  template: "typeParam",
};

/**
 * Tells the plugin it is reading TypeScript, and which tag names to accept.
 *
 * @remarks
 *   These belong in the block's `settings` rather than its `rules`, so they
 *   reach every rule the plugin runs at once and stay in place wherever the
 *   rules themselves are turned off.
 */
export const DOCBLOCK_SETTINGS = {
  jsdoc: { mode: "typescript", tagNamePreference: TSDOC_TAGS },
};

/**
 * Checks that a block exists, that it parses, and that its text says something.
 *
 * @remarks
 *   The fixer is off. A block these rules could write would restate the name of
 *   the declaration it sits above, and `informative-docs` refuses exactly that,
 *   so the sentence is left for the author.
 */
export const DOCBLOCK: PluginRules = {
  "jsdoc-js/check-indentation": ["error", { excludeTags: TAG_ORDER }],
  "jsdoc-js/check-line-alignment": ["error", "never", { wrapIndent: "  " }],
  "jsdoc-js/check-param-names": ["error", ONE_PARAM_PER_OBJECT],
  "jsdoc-js/check-tag-names": ["error", { typed: false }],
  "jsdoc-js/check-template-names": "error",
  "jsdoc-js/informative-docs": "error",
  "jsdoc-js/match-description": [
    "error",
    {
      contexts: SUMMARISED,
      mainDescription: NO_GENERIC_OPENER,
      tags: { param: NO_VAGUE_OPENER, returns: NO_VAGUE_OPENER, throws: NO_VAGUE_OPENER },
    },
  ],
  "jsdoc-js/multiline-blocks": ["error", { noSingleLineBlocks: true }],
  "jsdoc-js/no-bad-blocks": "error",
  "jsdoc-js/no-blank-blocks": "error",
  "jsdoc-js/no-defaults": "error",
  "jsdoc-js/no-types": "error",
  "jsdoc-js/require-asterisk-prefix": "error",
  "jsdoc-js/require-description": "error",
  "jsdoc-js/require-description-complete-sentence": [
    "error",
    { tags: ["param", "returns", "typeParam", "throws"] },
  ],
  "jsdoc-js/require-hyphen-before-param-description": "error",
  "jsdoc-js/require-jsdoc": [
    "error",
    {
      checkGetters: true,
      checkSetters: true,
      contexts: DOCUMENTED,
      enableFixer: false,
      exemptOverloadedImplementations: true,
      require: {
        ClassDeclaration: true,
        ClassExpression: true,
        FunctionDeclaration: true,
        FunctionExpression: true,
        MethodDefinition: true,
      },
    },
  ],
  "jsdoc-js/require-param-description": "error",
  "jsdoc-js/require-param-name": "error",
  "jsdoc-js/require-returns-check": "error",
  "jsdoc-js/require-returns-description": "error",
  "jsdoc-js/require-throws": "error",
  "jsdoc-js/sort-tags": [
    "error",
    { linesBetween: 0, reportTagGroupSpacing: false, tagSequence: [{ tags: TAG_ORDER }] },
  ],
  "jsdoc-js/tag-lines": ["error", "never", { startLines: 1 }],
  "tsdoc/syntax": "error",
};

/**
 * Returns every rule in {@link DOCBLOCK}, each set to `off`.
 *
 * @remarks
 *   The names are read back out of the group rather than listed a second time
 *   beside it. A rule added to the group is therefore off wherever this result
 *   is applied, with nobody having to remember the other list.
 */
export function docblocksOff(): PluginRules {
  return Object.fromEntries(Object.keys(DOCBLOCK).map((rule) => [rule, "off"]));
}
