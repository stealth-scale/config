/**
 * Draws a box a person types several lines into.
 *
 * @remarks
 *   The box grows with the text when `grows` is set. The component writes the text into an
 *   attribute on the root, and the recipe draws a hidden copy of it in the same grid cell as the
 *   control. The cell takes the height of the taller of the two, which is the copy, so the box is
 *   the right height on the frame the text changes. Nothing is measured and no layout is read.
 *   The value is held here where a caller does not hold it, so one component serves both. A caller
 *   that holds it gets the same growth, because the attribute is written from whichever value is
 *   in force.
 *   The variants sit on the root, since a slot recipe resolves them where a provider states them.
 */

import { type ComponentProps, type ReactElement } from "react";

import { useControllableState } from "@stealthscale/hooks";

import { withContext, withProvider } from "#textarea/context.ts";
import { VALUE } from "#textarea/recipe.ts";

/**
 * Draws the box that measures the text.
 */
const Sized = withProvider("div", "root");

/**
 * Draws the control a person types into.
 */
const Typed = withContext("textarea", "control");

/**
 * Describes the variants the root states, which a caller sets on the component itself.
 *
 * @remarks
 *   Written out rather than read off the root's props. A styled element takes every CSS property as
 *   a prop, so reading its props for an axis picks up whichever style prop shares the name.
 */
interface Variants {
  /**
   * Which way a person can drag the box bigger. Default: `vertical`.
   */
  readonly grip?: "both" | "none" | "vertical" | undefined;

  /**
   * Whether the box takes its height from the text rather than from a number of lines.
   */
  readonly grows?: boolean | undefined;

  /**
   * How much room the box leaves round its text. Default: `md`.
   */
  readonly size?: "lg" | "md" | "sm" | undefined;

  /**
   * The palette the edge is drawn in where the box reports something.
   */
  readonly status?: "error" | "info" | "success" | "warning" | undefined;

  /**
   * How the edge is drawn. Default: `outline`.
   */
  readonly variant?: "flushed" | "outline" | "subtle" | undefined;
}

/**
 * Describes what a textarea takes.
 */
export interface TextareaProps
  extends Omit<ComponentProps<typeof Typed>, "defaultValue" | "onChange" | "value">, Variants {
  /**
   * Fills the box before a caller drives it.
   */
  readonly defaultValue?: string | undefined;

  /**
   * Hears the box's contents each time they change.
   */
  readonly onValueChange?: ((value: string) => void) | undefined;

  /**
   * Fills the box, where a caller drives it.
   */
  readonly value?: string | undefined;
}

/**
 * Describes the variants a caller stated, each without the absent case.
 */
type Stated = { readonly [Axis in keyof Variants]?: Exclude<Variants[Axis], undefined> };

/**
 * Drops the variants a caller left unstated.
 *
 * @remarks
 *   A variant the compiler generates is optional and does not take `undefined`, so a prop passed as
 *   `undefined` is rejected where an absent one is accepted.
 * @param variants - The variants as the component received them.
 * @returns The ones a caller stated.
 */
function picked(variants: Variants): Stated {
  // Every entry kept is one whose value is not undefined, which is what Stated says.
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
  return Object.fromEntries(Object.entries(variants).filter(([, value]) => value !== undefined));
}

/**
 * Draws the box, growing with its text where a caller asks.
 *
 * @param props - The recipe's variants, the value, and everything a styled textarea takes.
 * @returns The box, holding the control and the copy that measures it.
 */
export function Textarea({
  defaultValue = "",
  grip,
  grows,
  onValueChange,
  rows = 3,
  size,
  status,
  value,
  variant,
  ...rest
}: TextareaProps): ReactElement {
  const [held, setHeld] = useControllableState<string>({
    defaultValue,
    onChange: onValueChange,
    value,
  });
  const stated = picked({ grip, grows, size, status, variant });

  return (
    <Sized {...{ [VALUE]: held }} {...stated}>
      <Typed
        {...rest}
        onChange={(event) => {
          setHeld(event.target.value);
        }}
        rows={rows}
        value={held}
      />
    </Sized>
  );
}
