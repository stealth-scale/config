/**
 * The docblock standard, as rules a linter can check.
 *
 * The standard is TSDoc, and two plugins share the work because they answer different questions:
 * `tsdoc/syntax` asks whether a docblock is valid TSDoc, and the jsdoc plugin asks whether there is
 * one at all, whether it covers the signature, and whether it says anything. Neither alone is the
 * standard.
 */

import { type PluginRules } from "#lint/rules/rules.ts";

/**
 * The order a docblock's tags are written in.
 *
 * TSDoc's own names throughout, in one group, so the tags stay contiguous and `tag-lines` alone
 * decides the blank line before them.
 */
const TAG_ORDER = [
  "packageDocumentation",
  "remarks",
  "typeParam",
  "param",
  "returns",
  "throws",
  "example",
  "see",
  "deprecated",
];

/**
 * The openers that say nothing, refused wherever a tag describes something.
 *
 * A pure negative lookahead: this is about how a sentence starts, and whether it is a sentence at
 * all is `require-description-complete-sentence`'s question.
 */
const NO_VAGUE_OPENER = String.raw`^(?!(?:What|Whatever|Something|Anything|Stuff)\b)`;

/**
 * Where a docblock is required beyond the declarations `require` already names.
 *
 * A constant inside a function is deliberately absent: the standard documents what a reader outside
 * the body can name, and a local is not that. The last selector matches the export statement rather
 * than the declaration inside it, because a docblock above `export const` attaches to the export
 * and a selector reaching past it reports a block that is there.
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
 * A destructured object parameter is documented as one `@param` named for its interface, and its
 * members are documented on that interface where the editor reads them. The plugin would otherwise
 * ask for one line per destructured member, which is every props type written twice.
 */
const ONE_PARAM_PER_OBJECT = { checkDestructured: false };

/**
 * The spellings the jsdoc plugin has to be told about, because its own defaults are JSDoc's.
 *
 * Left alone it rewrites `@packageDocumentation` to `@file` and knows nothing of `@typeParam`. Each
 * entry maps the JSDoc name it would reach for to the TSDoc name the standard uses, which also
 * makes the JSDoc spelling an error rather than a second accepted form.
 */
export const TSDOC_TAGS = {
  default: "defaultValue",
  file: "packageDocumentation",
  fileoverview: "packageDocumentation",
  return: "returns",
  template: "typeParam",
};

/**
 * What the jsdoc plugin needs told, since its defaults are JSDoc's rather than TSDoc's.
 *
 * `mode` is what stops it reading a tag's first brace as a type at all.
 */
export const DOCBLOCK_SETTINGS = {
  jsdoc: { mode: "typescript", tagNamePreference: TSDOC_TAGS },
};

/**
 * The docblock standard, rule by rule.
 *
 * The syntax is TSDoc's, which `tsdoc/syntax` checks; what follows is the policy on top of it.
 *
 * Everything with a name carries a block, exported or not, in the multi-line form, with a summary
 * that is a sentence and does not restate the name. A tag is not required into existence: a
 * `@param` repeating the parameter's name says nothing the signature has not, and a rule demanding
 * one manufactures exactly the filler that `informative-docs` then reports. What a tag does carry
 * is checked — its name must match a parameter, its description must be a sentence, and it must not
 * restate what it describes.
 *
 * `@throws` is the exception, and required: a thrown error appears nowhere in the signature, so
 * naming one is information rather than repetition.
 *
 * No tag carries a type. TypeScript declares them already, a second copy is a second thing to keep
 * true, and TSDoc leaves them out for that reason.
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
      mainDescription: false,
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
 * The same rules, off.
 *
 * Derived from {@link DOCBLOCK} rather than listed, so a rule added above is turned off here without
 * anybody remembering to.
 *
 * @returns Every docblock rule, each set to `off`.
 */
export function docblocksOff(): PluginRules {
  return Object.fromEntries(Object.keys(DOCBLOCK).map((rule) => [rule, "off"]));
}
