/**
 * What order a declaration is written in.
 */

/**
 * Declarations in alphabetical order.
 *
 * Google asks for this and marks it optional. It is taken because the house already sorts
 * everything whose order carries no meaning — imports, object literals, union members — and a
 * declaration block is the same kind of list. A diff then shows a declaration changing rather than
 * a block being reshuffled.
 *
 * Alphabetical happens to keep a shorthand above its longhands, because a shorthand's name is a
 * prefix of theirs: `background` sorts above `background-color`, `font` above `font-size`. The
 * order that reads well and the order that applies correctly are the same one.
 *
 * The one cost is that nothing fixes it during a build. The formatter does not sort declarations
 * and the plugin ignores a `fix` passed to it, so a violation is corrected by hand or by
 * stylelint's own command. A repository that would rather not pay that turns this off by name.
 */
export const ORDER = {
  "order/properties-alphabetical-order": true,
};
