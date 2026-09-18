/**
 * Draws a component once per value of an axis, each cell captioned with the value it was drawn
 * for.
 */

import { type ReactElement, type ReactNode } from "react";

import { Stack } from "@stealthscale/component-layout";

import { type Axis, captionOf, nameOf } from "#matrix/axis.ts";
import { Caption } from "#matrix/caption.tsx";

/**
 * Describes what a matrix takes.
 *
 * @typeParam Value - What one cell is drawn for.
 */
export interface MatrixProps<Value> extends Axis<Value> {
  /**
   * Draws one cell.
   */
  children: (value: Value) => ReactNode;

  /**
   * Which way the cells run. Down by default, because most components are wider than they are
   * tall and a row of them wraps.
   */
  direction?: "column" | "row";
}

/**
 * Draws one captioned cell per value of the axis.
 *
 * @remarks
 *   Both arrangements are written out rather than forwarded to one stack, because the compiler
 *   extracts a value written as a JSX literal and nothing it reads from a prop. A stack given
 *   `direction={direction}` would carry the class of neither direction.
 */
export function Matrix<Value>({
  children,
  direction = "column",
  ...axis
}: MatrixProps<Value>): ReactElement {
  const cells = axis.of.map((value) => (
    <Stack align="flex-start" gap="xs" key={captionOf(axis, value)}>
      <Caption knob={axis.knob}>{nameOf(axis, value)}</Caption>
      {children(value)}
    </Stack>
  ));

  if (direction === "row") {
    return (
      <Stack align="flex-start" direction="row" gap="lg" wrap>
        {cells}
      </Stack>
    );
  }

  return (
    <Stack align="flex-start" gap="lg">
      {cells}
    </Stack>
  );
}
