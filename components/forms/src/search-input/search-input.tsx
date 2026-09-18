/**
 * Draws a search field: a text field that empties itself from a control at its end.
 *
 * @remarks
 *   The box, the field and the room the field leaves at its end are the input group's, so a theme
 *   that moves every grouped field moves this one and neither recipe restates the other. The
 *   control is a part of this recipe rather than a button from elsewhere, which keeps this package
 *   off every other component package.
 *   The control is drawn only where there is something to clear. A control that is always there
 *   and does nothing half the time is a control a reader learns to pass over, and a keyboard
 *   reaches it either way. Clearing puts focus back in the field, because a person who has just
 *   emptied a search is about to type another one.
 */

import { type ComponentProps, type ReactElement, type ReactNode, useCallback, useRef } from "react";

import { useControllableState } from "@stealthscale/hooks";

import { End } from "#input-group/end.ts";
import { Field } from "#input-group/field.ts";
import { Root } from "#input-group/root.ts";
import { withContext } from "#search-input/context.ts";

/**
 * Draws the control that empties the field.
 */
const Clear = withContext("button", { defaultProps: { type: "button" } });

/**
 * Describes what a search field takes.
 */
export interface SearchInputProps extends Omit<
  ComponentProps<typeof Field>,
  "defaultValue" | "onChange" | "value"
> {
  /**
   * Drawn inside the control that empties the field, which is drawn only where one is given.
   */
  readonly clearIndicator?: ReactNode | undefined;

  /**
   * Reads out as the name of the control that empties the field.
   */
  readonly clearLabel?: string | undefined;

  /**
   * Fills the field before a caller drives it.
   */
  readonly defaultValue?: string | undefined;

  /**
   * Hears the field's contents each time they change.
   */
  readonly onValueChange?: ((value: string) => void) | undefined;

  /**
   * Fills the field, where a caller drives it.
   */
  readonly value?: string | undefined;
}

/**
 * Draws a field a person searches from.
 *
 * @param props - The field's own, plus what it holds and how the control is named.
 * @returns The field and, where it holds something, the control that empties it.
 */
export function SearchInput({
  clearIndicator,
  clearLabel = "Clear search",
  defaultValue = "",
  onValueChange,
  size,
  value,
  ...rest
}: SearchInputProps): ReactElement {
  const field = useRef<HTMLInputElement>(null);
  const [held, setHeld] = useControllableState<string>({
    defaultValue,
    onChange: onValueChange,
    value,
  });

  const clear = useCallback((): void => {
    setHeld("");
    field.current?.focus();
  }, [setHeld]);

  const sized = size === undefined ? {} : { size };
  const shown = held !== "" && clearIndicator !== undefined;

  return (
    <Root {...sized} marks="end">
      <Field
        {...rest}
        {...sized}
        onChange={(event) => {
          setHeld(event.target.value);
        }}
        ref={field}
        type="search"
        value={held}
      />
      {shown ? (
        <End {...sized}>
          <Clear {...sized} aria-label={clearLabel} onClick={clear}>
            {clearIndicator}
          </Clear>
        </End>
      ) : undefined}
    </Root>
  );
}
