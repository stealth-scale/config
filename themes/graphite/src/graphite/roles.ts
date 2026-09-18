/**
 * Places every role on Graphite's own steps: the surfaces, the inks and the lines on the neutral
 * ramp, and the twelve roles of each hue palette on its ramp.
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
  DEFAULT: [0, 1],
  disabled: [2, 3],
  emphasized: [3, 4],
  inverted: [12, 13],
  muted: [2, 3],
  panel: [0, 0],
  popover: [0, 0],
  subtle: [1, 2],
};

/**
 * Places the inks a page is written in on the neutral ramp.
 */
export const INKS: Steps<"DEFAULT" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [13, 12],
  inverted: [0, 0],
  muted: [9, 9],
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
    border: [4, 5],
    "border.hover": [5, 4],
    contrast: { value: { _dark: "{colors.gray.dark.13}", base: "{colors.gray.0}" } },
    emphasized: [1, 8],
    fg: [6, 3],
    "fg.muted": [6, 3],
    focusRing: [5, 5],
    muted: [1, 9],
    solid: [5, 5],
    "solid.hover": [6, 5],
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
    border: [8, 8],
    "border.hover": [9, 9],
    contrast: { value: { _dark: "{colors.gray.dark.13}", base: "{colors.gray.0}" } },
    emphasized: [4, 1],
    fg: [9, 9],
    "fg.muted": [9, 9],
    focusRing: [9, 9],
    muted: [3, 0],
    solid: [9, 8],
    "solid.hover": [10, 8],
    subtle: [2, "tint"],
  },
  green: {
    bg: [0, 9],
    border: [4, 5],
    "border.hover": [5, 4],
    contrast: { value: { _dark: "{colors.gray.dark.13}", base: "{colors.gray.0}" } },
    emphasized: [1, 8],
    fg: [6, 3],
    "fg.muted": [6, 3],
    focusRing: [5, 5],
    muted: [1, 9],
    solid: [5, 5],
    "solid.hover": [6, 5],
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
    border: [4, 5],
    "border.hover": [5, 4],
    contrast: { value: { _dark: "{colors.gray.dark.13}", base: "{colors.gray.0}" } },
    emphasized: [0, 9],
    fg: [5, 4],
    "fg.muted": [5, 4],
    focusRing: [5, 5],
    muted: [0, 9],
    solid: [5, 5],
    "solid.hover": [6, 5],
    subtle: [0, "tint"],
  },
  pink: {
    bg: [0, 9],
    border: [4, 5],
    "border.hover": [5, 4],
    contrast: { value: { _dark: "{colors.gray.dark.13}", base: "{colors.gray.0}" } },
    emphasized: [0, 9],
    fg: [5, 4],
    "fg.muted": [5, 4],
    focusRing: [5, 5],
    muted: [0, 9],
    solid: [5, 5],
    "solid.hover": [6, 5],
    subtle: [0, "tint"],
  },
  purple: {
    bg: [0, 9],
    border: [4, 5],
    "border.hover": [5, 4],
    contrast: { value: { _dark: "{colors.gray.dark.13}", base: "{colors.gray.0}" } },
    emphasized: [0, "tint"],
    fg: [5, 4],
    "fg.muted": [5, 4],
    focusRing: [5, 5],
    muted: [0, 9],
    solid: [5, 5],
    "solid.hover": [6, 5],
    subtle: [0, "tint"],
  },
  red: {
    bg: [0, 9],
    border: [4, 5],
    "border.hover": [5, 4],
    contrast: { value: { _dark: "{colors.gray.dark.13}", base: "{colors.gray.0}" } },
    emphasized: [1, 8],
    fg: [6, 3],
    "fg.muted": [6, 3],
    focusRing: [5, 5],
    muted: [1, 9],
    solid: [5, 5],
    "solid.hover": [6, 5],
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
    border: [4, 5],
    "border.hover": [5, 4],
    contrast: { value: { _dark: "{colors.gray.dark.13}", base: "{colors.gray.0}" } },
    emphasized: [1, 8],
    fg: [6, 3],
    "fg.muted": [6, 3],
    focusRing: [5, 5],
    muted: [1, 9],
    solid: [5, 5],
    "solid.hover": [6, 5],
    subtle: [0, "tint"],
  },
};
