/**
 * Reads what a rendered component reports about itself on the attributes of its parts.
 *
 * @remarks
 *   Every reader here finds its part first and throws naming the selector when the render carries
 *   nothing under that name. An absent part is a defect in the component or in the specification,
 *   and never a missing value the caller should go on to handle.
 */

import { part } from "#part.ts";

/**
 * Returns a data attribute a part carries, or undefined where it carries none.
 *
 * @remarks
 *   The attribute is named in the camel-case form the dataset uses, so a component writing
 *   data-crop-shape is asked for cropShape. A caller passing the written form gets undefined back
 *   and no complaint, and {@link aria} is the reader that takes attributes as they are written.
 */
export function attr(container: ParentNode, name: string, attribute: string): string | undefined {
  return part(container, name).dataset[attribute];
}

/**
 * Returns an attribute a part exposes to assistive technology, or undefined where it exposes none.
 *
 * @remarks
 *   The attribute is named as the markup spells it, aria-current rather than ariaCurrent. Any
 *   attribute at all can be read this way, and {@link attr} is the shorter form for a data one.
 */
export function aria(container: ParentNode, name: string, attribute: string): string | undefined {
  return part(container, name).getAttribute(attribute) ?? undefined;
}

/**
 * Returns true when one part sits inside another, at any depth.
 *
 * @remarks
 *   A part nested several levels down still counts, so a positioner holds the content a library
 *   wrapped in elements of its own. A part that is absent throws rather than reading as false,
 *   which keeps a renamed part from passing for a tree that came out the wrong shape.
 */
export function holds(container: ParentNode, outer: string, inner: string): boolean {
  return part(container, outer).contains(part(container, inner));
}

/**
 * Returns the tag a part rendered as, upper-cased.
 *
 * @remarks
 *   The document reports an HTML tag upper-cased and an SVG one as it was written, which would
 *   otherwise leave an icon as the one part a specification has to name in lower case. Both come
 *   back upper-cased here, so DIV and SVG are compared the same way.
 */
export function renderedAs(container: ParentNode, name: string): string {
  return part(container, name).tagName.toUpperCase();
}
