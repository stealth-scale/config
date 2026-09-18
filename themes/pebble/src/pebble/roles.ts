/**
 * Places every role on Pebble's own steps: the surfaces, the inks and the lines on the neutral
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
  backdrop: { value: { _dark: "rgb(0 0 0 / 0.5)", base: "rgb(0 0 0 / 0.5)" } },
  DEFAULT: ["white", 950],
  disabled: [100, 800],
  emphasized: [200, 700],
  inverted: [900, 200],
  muted: [100, 800],
  panel: ["white", 900],
  popover: ["white", 900],
  subtle: [50, 900],
};

/**
 * Places the inks a page is written in on the neutral ramp.
 */
export const INKS: Steps<"DEFAULT" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [950, 50],
  inverted: [50, 900],
  muted: [600, 300],
  subtle: [500, 400],
};

/**
 * Places the lines between things on the neutral ramp.
 */
export const LINES: Steps<"DEFAULT" | "emphasized" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [200, 800],
  emphasized: [500, 400],
  inverted: [800, 200],
  muted: [100, 900],
  subtle: [50, 950],
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
    bg: [50, 950],
    border: [500, 600],
    "border.hover": [600, 500],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: [200, 800],
    fg: [700, 300],
    "fg.muted": [700, 300],
    focusRing: [600, 400],
    muted: [100, 900],
    solid: [600, 500],
    "solid.hover": [700, 400],
    subtle: [50, 950],
  },
  cyan: {
    bg: [50, 950],
    border: [600, 700],
    "border.hover": [700, 600],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: [100, 900],
    fg: [700, 300],
    "fg.muted": [700, 400],
    focusRing: [700, 500],
    muted: [100, 900],
    solid: [700, 500],
    "solid.hover": [800, 600],
    subtle: [50, 950],
  },
  gray: {
    bg: ["white", 950],
    border: [500, 500],
    "border.hover": [600, 400],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: [200, 700],
    fg: [900, 50],
    "fg.muted": [600, 300],
    focusRing: [500, 400],
    muted: [100, 800],
    solid: [900, 200],
    "solid.hover": [800, 300],
    subtle: [100, 800],
  },
  green: {
    bg: [50, 950],
    border: [600, 700],
    "border.hover": [700, 600],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: [200, 900],
    fg: [800, 300],
    "fg.muted": [800, 400],
    focusRing: [700, 500],
    muted: [100, 900],
    solid: [700, 500],
    "solid.hover": [800, 600],
    subtle: [50, 950],
  },
  indigo: {
    bg: [50, 950],
    border: [400, 600],
    "border.hover": [500, 500],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: [100, 800],
    fg: [700, 200],
    "fg.muted": [600, 300],
    focusRing: [600, 400],
    muted: [100, 900],
    solid: [600, 500],
    "solid.hover": [500, 400],
    subtle: [50, 950],
  },
  orange: {
    bg: [50, 950],
    border: [600, 700],
    "border.hover": [700, 600],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: [200, 900],
    fg: [800, 300],
    "fg.muted": [800, 300],
    focusRing: [700, 500],
    muted: [100, 900],
    solid: [700, 500],
    "solid.hover": [800, 600],
    subtle: [50, 950],
  },
  pink: {
    bg: [50, 950],
    border: [500, 700],
    "border.hover": [600, 600],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: [100, 950],
    fg: [700, 300],
    "fg.muted": [700, 400],
    focusRing: [600, 400],
    muted: [100, 950],
    solid: [600, 500],
    "solid.hover": [700, 400],
    subtle: [50, 950],
  },
  purple: {
    bg: [50, 950],
    border: [500, 600],
    "border.hover": [600, 500],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: [100, 800],
    fg: [700, 200],
    "fg.muted": [600, 300],
    focusRing: [600, 400],
    muted: [100, 900],
    solid: [600, 500],
    "solid.hover": [700, 400],
    subtle: [50, 950],
  },
  red: {
    bg: [50, 950],
    border: [500, 700],
    "border.hover": [600, 600],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: [200, 900],
    fg: [700, 300],
    "fg.muted": [700, 300],
    focusRing: [600, 400],
    muted: [100, 900],
    solid: [600, 500],
    "solid.hover": [700, 400],
    subtle: [50, 950],
  },
  teal: {
    bg: [50, 950],
    border: [600, 700],
    "border.hover": [700, 600],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: [100, 900],
    fg: [700, 300],
    "fg.muted": [700, 400],
    focusRing: [700, 500],
    muted: [100, 900],
    solid: [700, 500],
    "solid.hover": [800, 600],
    subtle: [50, 950],
  },
  yellow: {
    bg: [50, 950],
    border: [700, 700],
    "border.hover": [800, 600],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: [100, 900],
    fg: [700, 300],
    "fg.muted": [700, 400],
    focusRing: [700, 500],
    muted: [100, 900],
    solid: [700, 500],
    "solid.hover": [800, 600],
    subtle: [50, 950],
  },
};
