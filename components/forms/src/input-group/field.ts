/**
 * Draws the control the marks are placed against.
 *
 * @remarks
 *   Binds the text field, so a group holding one needs no `as` and a theme that moves every field
 *   moves this one. A caller puts another control in its place with `as`, which the factory draws
 *   under both recipes: `as={Select.Trigger}` keeps the trigger's own styling and takes the room
 *   this slot reserves.
 *   A native `select` is the one control this does not hold at both ends. The browser draws its
 *   own arrow at the inline end and places it itself, so an end mark lands on top of one.
 */

import { type ComponentProps } from "react";

import { withContext } from "#input-group/context.ts";
import { Input } from "#input/input.ts";

/**
 * Draws the control, inset by the room its marks take.
 */
export const Field = withContext(Input, "field");

/**
 * Describes what the control takes: the text field's variants, and everything a styled input
 * takes.
 */
export type FieldProps = ComponentProps<typeof Field>;
