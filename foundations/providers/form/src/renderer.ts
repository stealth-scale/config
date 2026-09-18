/**
 * Types a renderer, which draws one field, and picks the one that suits a field best.
 */

import { type ComponentType } from "react";

import { type Field } from "#presentation.ts";
import { type Schema } from "#schema.ts";

/**
 * Describes what a renderer is handed. The field itself is read through `useFieldContext`, as
 * every field component bound with `createFormHook` reads it.
 */
export interface RendererProps {
  /**
   * How the field is drawn, merged from the schema and the call site.
   */
  readonly presentation: Field;

  /**
   * Whether the resolved schema requires the field.
   */
  readonly required: boolean;

  /**
   * The resolved schema at the field's path.
   */
  readonly schema: Schema;
}

/**
 * Reports how well a renderer suits a field, and nothing where it does not suit it at all.
 */
export type Suits = (presentation: Field, schema: Schema) => number | undefined;

/**
 * Describes a renderer: a field component, and how well it suits a field.
 */
export interface Renderer {
  /**
   * Draws the field, frame included, as a field component bound to the contexts does.
   */
  readonly draw: ComponentType<RendererProps>;

  /**
   * Reports how well it suits a field.
   */
  readonly suits: Suits;
}

/**
 * Lists the ranks a renderer answers with, so two packages rank the same way.
 *
 * @remarks
 *   A type alone is the weakest fit, a format or a constraint on it is stronger, and a field that
 *   names the renderer by `control` is the strongest.
 */
export const RANK = { constraint: 3, control: 10, format: 2, type: 1 } as const;

/**
 * Builds the answer of a renderer that suits a field naming it by `control`.
 *
 * @param name - The name a field writes in `control`.
 */
export function byControl(name: string): Suits {
  return (presentation) => (presentation.control === name ? RANK.control : undefined);
}

/**
 * Picks the renderer that suits a field best.
 *
 * @remarks
 *   Two renderers answering the same rank are settled by registration order, and the later one is
 *   picked, so a package overrides a default by registering after it.
 * @returns The renderer, or nothing where none suits the field.
 */
export function rendererFor(
  renderers: readonly Renderer[],
  presentation: Field,
  schema: Schema,
): Renderer | undefined {
  let picked: Renderer | undefined;
  let best = Number.NEGATIVE_INFINITY;

  for (const renderer of renderers) {
    const rank = renderer.suits(presentation, schema);

    if (rank !== undefined && rank >= best) {
      picked = renderer;
      best = rank;
    }
  }

  return picked;
}
