/**
 * Builds the group a part's specification needs above it.
 */

import { type ReactElement, type ReactNode } from "react";

import { End } from "#input-group/end.ts";
import { Field } from "#input-group/field.ts";
import { Root, type RootProps } from "#input-group/root.ts";
import { Start } from "#input-group/start.ts";

/**
 * Draws whatever a case wants measured inside the root that states the variants.
 *
 * @param children - The part under test.
 * @returns The root, holding it.
 */
export function grouped(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Draws a whole group, so a case can read what the field and both marks did.
 *
 * @param props - Whatever the case sets on the root.
 * @returns The four parts composed the way a caller composes them.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Start aria-hidden>€</Start>
      <Field aria-label="Amount" />
      <End aria-hidden>kg</End>
    </Root>
  );
}
