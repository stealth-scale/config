/**
 * Places every role on Steel gray's own steps: the surfaces, the inks and the lines on the neutral
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
  backdrop: { value: { _dark: "rgba(0, 0, 0, 0.6)", base: "rgba(0, 0, 0, 0.6)" } },
  DEFAULT: [10, 90],
  disabled: [30, 80],
  emphasized: [40, 70],
  inverted: [80, 10],
  muted: [30, 70],
  panel: ["white", 80],
  popover: ["white", 70],
  subtle: [20, 80],
};

/**
 * Places the inks a page is written in on the neutral ramp.
 */
export const INKS: Steps<"DEFAULT" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [100, 10],
  inverted: ["white", 100],
  muted: [80, 30],
  subtle: [70, 30],
};

/**
 * Places the lines between things on the neutral ramp.
 */
export const LINES: Steps<"DEFAULT" | "emphasized" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [20, 60],
  emphasized: [70, 40],
  inverted: [100, 10],
  muted: [30, 70],
  subtle: [20, 80],
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
    bg: [10, 100],
    border: [60, 50],
    "border.hover": [70, 40],
    contrast: { value: { _dark: "{colors.gray.white}", base: "{colors.gray.white}" } },
    emphasized: [30, 80],
    fg: [80, 30],
    "fg.muted": [80, 30],
    focusRing: [70, 40],
    muted: [20, 90],
    solid: [60, 60],
    "solid.hover": [70, 60],
    subtle: [10, 100],
  },
  cyan: {
    bg: [10, 100],
    border: [60, 50],
    "border.hover": [70, 40],
    contrast: { value: { _dark: "{colors.gray.white}", base: "{colors.gray.white}" } },
    emphasized: [30, 80],
    fg: [70, 40],
    "fg.muted": [70, 40],
    focusRing: [70, 40],
    muted: [20, 90],
    solid: [60, 60],
    "solid.hover": [70, 60],
    subtle: [10, 100],
  },
  gray: {
    bg: [10, 90],
    border: [50, 60],
    "border.hover": [60, 50],
    contrast: { value: { _dark: "{colors.gray.white}", base: "{colors.gray.white}" } },
    emphasized: [40, 70],
    fg: [80, 30],
    "fg.muted": [80, 30],
    focusRing: [70, 40],
    muted: [30, 70],
    solid: [80, 60],
    "solid.hover": [90, 60],
    subtle: [20, 80],
  },
  green: {
    bg: [10, 100],
    border: [60, 50],
    "border.hover": [70, 40],
    contrast: { value: { _dark: "{colors.gray.white}", base: "{colors.gray.white}" } },
    emphasized: [30, 80],
    fg: [80, 30],
    "fg.muted": [80, 30],
    focusRing: [70, 40],
    muted: [20, 90],
    solid: [60, 60],
    "solid.hover": [70, 60],
    subtle: [10, 100],
  },
  indigo: {
    bg: [50, 950],
    border: [500, 500],
    "border.hover": [600, 400],
    contrast: { value: { _dark: "{colors.gray.100}", base: "{colors.gray.white}" } },
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
    bg: [10, 100],
    border: [60, 50],
    "border.hover": [70, 40],
    contrast: { value: { _dark: "{colors.gray.white}", base: "{colors.gray.white}" } },
    emphasized: [30, 80],
    fg: [70, 40],
    "fg.muted": [70, 40],
    focusRing: [70, 40],
    muted: [20, 90],
    solid: [60, 60],
    "solid.hover": [70, 60],
    subtle: [10, 100],
  },
  pink: {
    bg: [10, 100],
    border: [60, 50],
    "border.hover": [70, 40],
    contrast: { value: { _dark: "{colors.gray.white}", base: "{colors.gray.white}" } },
    emphasized: [30, 80],
    fg: [70, 40],
    "fg.muted": [70, 40],
    focusRing: [70, 40],
    muted: [20, 90],
    solid: [60, 60],
    "solid.hover": [70, 60],
    subtle: [10, 100],
  },
  purple: {
    bg: [10, 100],
    border: [60, 50],
    "border.hover": [70, 40],
    contrast: { value: { _dark: "{colors.gray.white}", base: "{colors.gray.white}" } },
    emphasized: [30, 80],
    fg: [70, 40],
    "fg.muted": [70, 40],
    focusRing: [70, 40],
    muted: [20, 90],
    solid: [60, 60],
    "solid.hover": [70, 60],
    subtle: [10, 100],
  },
  red: {
    bg: [10, 100],
    border: [60, 50],
    "border.hover": [70, 40],
    contrast: { value: { _dark: "{colors.gray.white}", base: "{colors.gray.white}" } },
    emphasized: [30, 80],
    fg: [80, 30],
    "fg.muted": [80, 30],
    focusRing: [70, 40],
    muted: [20, 90],
    solid: [60, 60],
    "solid.hover": [70, 60],
    subtle: [10, 100],
  },
  teal: {
    bg: [10, 100],
    border: [60, 50],
    "border.hover": [70, 40],
    contrast: { value: { _dark: "{colors.gray.white}", base: "{colors.gray.white}" } },
    emphasized: [30, 80],
    fg: [70, 40],
    "fg.muted": [70, 40],
    focusRing: [70, 40],
    muted: [20, 90],
    solid: [60, 60],
    "solid.hover": [70, 60],
    subtle: [10, 100],
  },
  yellow: {
    bg: [10, 100],
    border: [60, 50],
    "border.hover": [70, 40],
    contrast: { value: { _dark: "{colors.gray.white}", base: "{colors.gray.white}" } },
    emphasized: [30, 80],
    fg: [80, 30],
    "fg.muted": [80, 30],
    focusRing: [70, 40],
    muted: [20, 90],
    solid: [60, 60],
    "solid.hover": [70, 60],
    subtle: [10, 100],
  },
};
