/**
 * Draws a box against the middle of the nearest positioned box.
 *
 * @remarks
 *   The translation is back by half of the box itself, so the centre is the box's middle rather
 *   than its edge, and it turns around under right-to-left writing on the axis that runs inline.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Describes what an absolutely centred box takes.
 */
export interface AbsoluteCenterProps {
  /**
   * Which axis to centre on. Both unless the caller says otherwise.
   */
  axis?: "both" | "horizontal" | "vertical" | undefined;
}

/**
 * Places the box on the axis given.
 */
const PLACED: Readonly<Record<NonNullable<AbsoluteCenterProps["axis"]>, SystemStyleObject>> = {
  both: {
    _rtl: { translate: "50% -50%" },
    insetInlineStart: "50%",
    top: "50%",
    translate: "-50% -50%",
  },
  horizontal: { _rtl: { translate: "50%" }, insetInlineStart: "50%", translate: "-50%" },
  vertical: { top: "50%", translate: "0 -50%" },
};

/**
 * Draws a box against the middle of the nearest positioned box, on the axis given.
 */
export function absoluteCenter(props: AbsoluteCenterProps = {}): SystemStyleObject {
  return {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    ...PLACED[props.axis ?? "both"],
  };
}
