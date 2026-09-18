/**
 * Places every role on Graphite high contrast's own steps: the surfaces, the inks and the lines on
 * the neutral ramp, and the twelve roles of each hue palette on its ramp.
 *
 * @remarks
 *   Each role is placed on a step of its own ramp, and one step along the ramp where the
 *   accessibility gate asks for it: 4.5:1 for text and 3:1 for a line or a ring.
 */

import { type RoleSteps, type Steps, type SurfaceSteps } from "@stealthscale/theme/authoring";

/**
 * Places the surfaces a page is built from on the neutral ramp.
 */
export const SURFACES: SurfaceSteps = {
  backdrop: { value: { _dark: "#d1d7e066", base: "#393f4666" } },
  DEFAULT: [0, 0],
  disabled: [4, 4],
  emphasized: [5, 4],
  inverted: [12, 13],
  muted: [4, 3],
  panel: [0, 0],
  popover: [0, 0],
  subtle: [3, 2],
};

/**
 * Places the inks a page is written in on the neutral ramp.
 */
export const INKS: Steps<"DEFAULT" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [13, 13],
  inverted: [0, 0],
  muted: [10, 10],
  subtle: [9, 9],
};

/**
 * Places the lines between things on the neutral ramp.
 */
export const LINES: Steps<"DEFAULT" | "emphasized" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [10, 10],
  emphasized: [10, 10],
  inverted: [0, 0],
  muted: [10, 10],
  subtle: [9, 9],
};

/**
 * Places the twelve roles of each hue palette on the ramp of that hue.
 */
export const ROLES: Readonly<
  Record<
    | "blue"
    | "cyan"
    | "gray"
    | "green"
    | "indigo"
    | "orange"
    | "pink"
    | "purple"
    | "red"
    | "teal"
    | "yellow",
    RoleSteps
  >
> = {
  blue: {
    bg: [0, 9],
    border: [3, 4],
    "border.hover": [4, 3],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [2, "tint"],
    fg: [6, 3],
    "fg.muted": [6, 3],
    focusRing: [5, 5],
    muted: [1, "tint"],
    solid: [5, 7],
    "solid.hover": [6, 6],
    subtle: [0, "tint"],
  },
  cyan: {
    bg: [50, 950],
    border: [500, 500],
    "border.hover": [600, 400],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [300, 700],
    fg: [950, 50],
    "fg.muted": [900, 200],
    focusRing: [600, 400],
    muted: [200, 800],
    solid: [700, 400],
    "solid.hover": [800, 300],
    subtle: [100, 900],
  },
  gray: {
    bg: [0, 0],
    border: [10, 10],
    "border.hover": [11, 11],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [6, 1],
    fg: [11, 11],
    "fg.muted": [11, 11],
    focusRing: [9, 10],
    muted: [5, 0],
    solid: [10, 9],
    "solid.hover": [11, 10],
    subtle: [4, "tint"],
  },
  green: {
    bg: [0, 9],
    border: [3, 4],
    "border.hover": [4, 3],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [1, "tint"],
    fg: [5, 3],
    "fg.muted": [5, 3],
    focusRing: [5, 5],
    muted: [1, "tint"],
    solid: [5, 7],
    "solid.hover": [6, 6],
    subtle: [0, "tint"],
  },
  indigo: {
    bg: [50, 950],
    border: [500, 500],
    "border.hover": [600, 400],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [300, 700],
    fg: [950, 50],
    "fg.muted": [900, 200],
    focusRing: [600, 400],
    muted: [200, 800],
    solid: [700, 400],
    "solid.hover": [800, 300],
    subtle: [100, 900],
  },
  orange: {
    bg: [0, 9],
    border: [3, 4],
    "border.hover": [4, 3],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [2, "tint"],
    fg: [6, 3],
    "fg.muted": [6, 3],
    focusRing: [5, 5],
    muted: [1, "tint"],
    solid: [5, 7],
    "solid.hover": [6, 6],
    subtle: [0, "tint"],
  },
  pink: {
    bg: [0, 9],
    border: [3, 4],
    "border.hover": [4, 3],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [2, "tint"],
    fg: [6, 3],
    "fg.muted": [6, 3],
    focusRing: [5, 5],
    muted: [1, "tint"],
    solid: [5, 7],
    "solid.hover": [6, 6],
    subtle: [0, "tint"],
  },
  purple: {
    bg: [0, 9],
    border: [3, 4],
    "border.hover": [4, 3],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [1, "tint"],
    fg: [5, 3],
    "fg.muted": [5, 3],
    focusRing: [5, 5],
    muted: [1, "tint"],
    solid: [5, 7],
    "solid.hover": [6, 6],
    subtle: [0, "tint"],
  },
  red: {
    bg: [0, 9],
    border: [3, 4],
    "border.hover": [4, 3],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [1, "tint"],
    fg: [5, 3],
    "fg.muted": [5, 3],
    focusRing: [5, 5],
    muted: [1, "tint"],
    solid: [5, 7],
    "solid.hover": [6, 6],
    subtle: [0, "tint"],
  },
  teal: {
    bg: [50, 950],
    border: [500, 500],
    "border.hover": [600, 400],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [300, 700],
    fg: [950, 50],
    "fg.muted": [900, 200],
    focusRing: [600, 400],
    muted: [200, 800],
    solid: [700, 400],
    "solid.hover": [800, 300],
    subtle: [100, 900],
  },
  yellow: {
    bg: [0, 9],
    border: [3, 4],
    "border.hover": [4, 3],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [2, "tint"],
    fg: [6, 3],
    "fg.muted": [6, 3],
    focusRing: [5, 5],
    muted: [1, "tint"],
    solid: [5, 7],
    "solid.hover": [6, 6],
    subtle: [0, "tint"],
  },
};
