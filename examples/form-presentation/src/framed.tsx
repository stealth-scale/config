/**
 * Draws a fieldset with a legend around a group that has one, and the group alone otherwise.
 */

import { type ReactNode } from "react";

/**
 * Describes what a frame around a group is given.
 */
export interface FramedProps {
  /**
   * The group's members, drawn.
   */
  readonly children: ReactNode;

  /**
   * The legend, or nothing where the group draws no fieldset.
   */
  readonly legend: string | undefined;
}

/**
 * Draws a fieldset with the legend around the members, or the members alone where there is no
 * legend.
 */
export function Framed({ children, legend }: FramedProps): ReactNode {
  return legend === undefined ? (
    children
  ) : (
    <fieldset>
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
}
