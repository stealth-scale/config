/**
 * Types what a field component reads of its field, so a component reads typed members rather
 * than the library's untyped ones.
 */

import { useFieldContext } from "@stealthscale/provider-form";

/**
 * Describes the state of a field a component reads.
 *
 * @typeParam Value - The value the field holds.
 */
export interface FieldState<Value> {
  /**
   * The errors the field shows and whether a person has touched it.
   */
  readonly meta: {
    /**
     * The errors from every slot, in slot order.
     */
    readonly errors: readonly unknown[];

    /**
     * Whether a person has changed or left the field, or a submit was attempted.
     */
    readonly isTouched: boolean;
  };

  /**
   * The value as it is now.
   */
  readonly value: Value;
}

/**
 * Describes the members of a field a component reads and calls.
 *
 * @typeParam Value - The value the field holds.
 */
export interface FieldLike<Value> {
  /**
   * Marks the field left, which runs the blur validators.
   */
  readonly handleBlur: () => void;

  /**
   * Sets the value, which runs the change validators.
   */
  readonly handleChange: (value: Value) => void;

  /**
   * The path the field is bound to, which is its name in the form's values.
   */
  readonly name: string;

  /**
   * The state as it is now.
   */
  readonly state: FieldState<Value>;
}

/**
 * Reads the field a bound field component is drawing, typed over the value it holds.
 *
 * @remarks
 *   The library's context answers a field whose members are untyped. This shape names the four
 *   members a component reads, and every field the library builds satisfies it.
 * @typeParam Value - The value the field holds.
 */
export function useBoundField<Value>(): FieldLike<Value> {
  return useFieldContext<Value>();
}
