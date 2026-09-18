/**
 * Draws the heading over a set of rows.
 *
 * @remarks
 *   It names the set through the value both share, which is what a screen reader reads out as the
 *   reader enters the set. It is read one step below the rows it labels and in the quieter ink, so
 *   it separates the sets without competing with what a reader is choosing between.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Draws the heading at the size the root states.
 */
const Titled = withContext("div", "itemGroupLabel");

/**
 * Describes what the heading takes.
 */
export interface ItemGroupLabelProps extends ComponentProps<typeof Titled> {
  /**
   * Ties the heading to the set it names.
   */
  readonly value: string;
}

/**
 * Says what the rows below it have in common.
 *
 * @param props - The name the set shares, beside everything a styled div takes.
 * @returns The heading, carrying what the machine writes onto it.
 */
export function ItemGroupLabel({ value, ...rest }: ItemGroupLabelProps): ReactElement {
  const { api } = useMenu();

  return <Titled {...mergeProps(api.getItemGroupLabelProps({ htmlFor: value }), rest)} />;
}
