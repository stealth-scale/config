/**
 * Places every role on Lantern's own steps: the surfaces, the inks and the lines on the neutral
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
  backdrop: { value: { _dark: "rgba(0,0,0,0.45)", base: "rgba(0,0,0,0.45)" } },
  DEFAULT: [3, 13],
  disabled: [3, 9],
  emphasized: [5, 8],
  inverted: [9, 6],
  muted: [4, 10],
  panel: [1, 12],
  popover: [1, 10],
  subtle: [4, 13],
};

/**
 * Places the inks a page is written in on the neutral ramp.
 */
export const INKS: Steps<"DEFAULT" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [9, 2],
  inverted: [1, 1],
  muted: [8, 3],
  subtle: [8, 4],
};

/**
 * Places the lines between things on the neutral ramp.
 */
export const LINES: Steps<"DEFAULT" | "emphasized" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [5, 6],
  emphasized: [8, 4],
  inverted: [1, 12],
  muted: [4, 8],
  subtle: [2, 11],
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
    bg: [1, 1],
    border: [6, 6],
    "border.hover": [7, 7],
    contrast: { value: { _dark: "{colors.gray.dark.1}", base: "{colors.gray.1}" } },
    emphasized: [3, 3],
    fg: [8, 8],
    "fg.muted": [8, 8],
    focusRing: [7, 7],
    muted: [2, 2],
    solid: [7, 6],
    "solid.hover": [8, 6],
    subtle: [1, 1],
  },
  cyan: {
    bg: [1, 1],
    border: [7, 5],
    "border.hover": [8, 6],
    contrast: { value: { _dark: "{colors.gray.dark.13}", base: "{colors.gray.1}" } },
    emphasized: [2, 2],
    fg: [8, 6],
    "fg.muted": [8, 7],
    focusRing: [8, 6],
    muted: [2, 2],
    solid: [8, 6],
    "solid.hover": [9, 5],
    subtle: [1, 1],
  },
  gray: {
    bg: [3, 13],
    border: [7, 4],
    "border.hover": [8, 3],
    contrast: { value: { _dark: "{colors.gray.dark.13}", base: "{colors.gray.1}" } },
    emphasized: [5, 8],
    fg: [8, 3],
    "fg.muted": [8, 3],
    focusRing: [8, 4],
    muted: [4, 10],
    solid: [9, 4],
    "solid.hover": [8, 3],
    subtle: [4, 13],
  },
  green: {
    bg: [1, 1],
    border: [7, 5],
    "border.hover": [8, 6],
    contrast: { value: { _dark: "{colors.gray.dark.1}", base: "{colors.gray.1}" } },
    emphasized: [3, 2],
    fg: [9, 7],
    "fg.muted": [9, 7],
    focusRing: [8, 6],
    muted: [2, 2],
    solid: [8, 5],
    "solid.hover": [9, 5],
    subtle: [1, 1],
  },
  indigo: {
    bg: [1, 1],
    border: [5, 7],
    "border.hover": [6, 8],
    contrast: { value: { _dark: "{colors.gray.dark.13}", base: "{colors.gray.1}" } },
    emphasized: [2, 3],
    fg: [6, 8],
    "fg.muted": [7, 8],
    focusRing: [6, 7],
    muted: [2, 2],
    solid: [6, 7],
    "solid.hover": [7, 8],
    subtle: [1, 1],
  },
  orange: {
    bg: [1, 1],
    border: [7, 5],
    "border.hover": [8, 6],
    contrast: { value: { _dark: "{colors.gray.dark.1}", base: "{colors.gray.1}" } },
    emphasized: [3, 3],
    fg: [9, 7],
    "fg.muted": [9, 8],
    focusRing: [8, 6],
    muted: [2, 2],
    solid: [8, 5],
    "solid.hover": [9, 5],
    subtle: [1, 1],
  },
  pink: {
    bg: [1, 1],
    border: [6, 6],
    "border.hover": [7, 7],
    contrast: { value: { _dark: "{colors.gray.dark.1}", base: "{colors.gray.1}" } },
    emphasized: [1, 3],
    fg: [7, 8],
    "fg.muted": [7, 8],
    focusRing: [7, 7],
    muted: [1, 2],
    solid: [7, 6],
    "solid.hover": [8, 6],
    subtle: [1, 1],
  },
  purple: {
    bg: [1, 1],
    border: [5, 7],
    "border.hover": [6, 8],
    contrast: { value: { _dark: "{colors.gray.dark.13}", base: "{colors.gray.1}" } },
    emphasized: [2, 3],
    fg: [6, 8],
    "fg.muted": [7, 8],
    focusRing: [6, 8],
    muted: [2, 2],
    solid: [6, 8],
    "solid.hover": [5, 9],
    subtle: [1, 1],
  },
  red: {
    bg: [1, 1],
    border: [6, 6],
    "border.hover": [7, 7],
    contrast: { value: { _dark: "{colors.gray.dark.1}", base: "{colors.gray.1}" } },
    emphasized: [2, 3],
    fg: [8, 8],
    "fg.muted": [8, 8],
    focusRing: [7, 7],
    muted: [2, 2],
    solid: [7, 6],
    "solid.hover": [8, 6],
    subtle: [1, 1],
  },
  teal: {
    bg: [50, 950],
    border: [500, 500],
    "border.hover": [600, 400],
    contrast: { value: { _dark: "{colors.gray.dark.13}", base: "{colors.gray.1}" } },
    emphasized: [300, 700],
    fg: [950, 50],
    "fg.muted": [900, 200],
    focusRing: [600, 400],
    muted: [200, 800],
    solid: [700, 400],
    "solid.hover": [600, 500],
    subtle: [100, 900],
  },
  yellow: {
    bg: [1, 1],
    border: [8, 4],
    "border.hover": [9, 5],
    contrast: { value: { _dark: "{colors.gray.dark.13}", base: "{colors.gray.1}" } },
    emphasized: [3, 2],
    fg: [9, 6],
    "fg.muted": [9, 7],
    focusRing: [8, 6],
    muted: [2, 2],
    solid: [9, 6],
    "solid.hover": [10, 5],
    subtle: [1, 1],
  },
};
