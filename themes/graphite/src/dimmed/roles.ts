/**
 * Places every role on Graphite dimmed's own steps: the surfaces, the inks and the lines on the
 * neutral ramp, and the twelve roles of each hue palette on its ramp.
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
  backdrop: { value: { _dark: "#21283066", base: "#c8d1da66" } },
  DEFAULT: [0, 3],
  disabled: [2, 5],
  emphasized: [3, 7],
  inverted: [12, 13],
  muted: [2, 6],
  panel: [0, 5],
  popover: [0, 5],
  subtle: [1, 4],
};

/**
 * Places the inks a page is written in on the neutral ramp.
 */
export const INKS: Steps<"DEFAULT" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [13, 11],
  inverted: [0, 0],
  muted: [9, 10],
  subtle: [9, 9],
};

/**
 * Places the lines between things on the neutral ramp.
 */
export const LINES: Steps<"DEFAULT" | "emphasized" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [6, 7],
  emphasized: [9, 9],
  inverted: [0, 0],
  muted: [4, 6],
  subtle: [3, 5],
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
    border: [4, 4],
    "border.hover": [5, 3],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [1, 8],
    fg: [6, 2],
    "fg.muted": [6, 2],
    focusRing: [5, 3],
    muted: [1, 9],
    solid: [5, 4],
    "solid.hover": [6, 3],
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
    border: [8, 9],
    "border.hover": [9, 10],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [4, 1],
    fg: [9, 10],
    "fg.muted": [9, 10],
    focusRing: [9, 9],
    muted: [3, 0],
    solid: [9, 9],
    "solid.hover": [10, 10],
    subtle: [2, "tint"],
  },
  green: {
    bg: [0, 9],
    border: [4, 4],
    "border.hover": [5, 3],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [1, 8],
    fg: [6, 2],
    "fg.muted": [6, 2],
    focusRing: [5, 3],
    muted: [1, 9],
    solid: [5, 4],
    "solid.hover": [6, 3],
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
    border: [4, 4],
    "border.hover": [5, 3],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [0, "tint"],
    fg: [5, 3],
    "fg.muted": [5, 3],
    focusRing: [5, 3],
    muted: [0, 9],
    solid: [5, 4],
    "solid.hover": [6, 3],
    subtle: [0, "tint"],
  },
  pink: {
    bg: [0, 9],
    border: [4, 4],
    "border.hover": [5, 3],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [0, "tint"],
    fg: [5, 3],
    "fg.muted": [5, 3],
    focusRing: [5, 3],
    muted: [0, 9],
    solid: [5, 4],
    "solid.hover": [6, 3],
    subtle: [0, "tint"],
  },
  purple: {
    bg: [0, 9],
    border: [4, 4],
    "border.hover": [5, 3],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [0, 8],
    fg: [5, 2],
    "fg.muted": [5, 2],
    focusRing: [5, 3],
    muted: [0, 9],
    solid: [5, 4],
    "solid.hover": [6, 3],
    subtle: [0, "tint"],
  },
  red: {
    bg: [0, 9],
    border: [4, 4],
    "border.hover": [5, 3],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [1, 8],
    fg: [6, 2],
    "fg.muted": [6, 2],
    focusRing: [5, 3],
    muted: [1, 9],
    solid: [5, 4],
    "solid.hover": [6, 3],
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
    border: [4, 4],
    "border.hover": [5, 3],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [1, 8],
    fg: [6, 2],
    "fg.muted": [6, 2],
    focusRing: [5, 3],
    muted: [1, 9],
    solid: [5, 4],
    "solid.hover": [6, 3],
    subtle: [0, "tint"],
  },
};
