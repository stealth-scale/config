/**
 * Draws a media frame that crops an image or a video to a ratio.
 */

import type { SystemProperties, SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Describes what a frame takes.
 */
export interface FrameProps {
  /**
   * The ratio of the frame, as a step of the ratio scale.
   */
  ratio?: SystemProperties["aspectRatio"];
}

/**
 * Fixes the ratio a frame is drawn at when a caller states none.
 */
const RATIO = "landscape";

/**
 * Draws a frame from the props given, with the media inside it covering the frame.
 */
export function frame(props: FrameProps = {}): SystemStyleObject {
  return {
    "& > img, & > video": { blockSize: "100%", inlineSize: "100%", objectFit: "cover" },
    alignItems: "center",
    aspectRatio: props.ratio ?? RATIO,
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
  };
}
