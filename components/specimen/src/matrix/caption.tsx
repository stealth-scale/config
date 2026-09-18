/**
 * Draws the line above one cell of a matrix.
 */

import { type ReactElement } from "react";

import { Text } from "@stealthscale/component-typography";

/**
 * Describes what a caption takes.
 */
export interface CaptionProps {
  /**
   * The value the cell was drawn for.
   */
  children: string;

  /**
   * The prop the value was set on, written before it and left in the muted ink, because the prop
   * is the same on every cell and the value is what changes.
   */
  knob?: string | undefined;
}

/**
 * Draws a caption in the library's text: the prop in the muted ink where the axis names one, then
 * the value in full ink.
 *
 * @remarks
 *   The muted ink and no quieter. A line this small in a lighter ink fails the contrast every
 *   theme guarantees. Both inks are tones of the library's paragraph, so a theme that moves them
 *   moves the caption with them.
 */
export function Caption({ children, knob }: CaptionProps): ReactElement {
  return (
    <Text size="xs" tone="muted">
      {knob === undefined ? null : `${knob} = `}
      <Text as="span" tone="default" weight="medium">
        {children}
      </Text>
    </Text>
  );
}
