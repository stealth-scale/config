/**
 * Places every role on Asphalt's own steps: the surfaces, the inks and the lines on the neutral
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
  backdrop: { value: { _dark: "rgba(0, 0, 0, 0.7)", base: "rgba(0, 0, 0, 0.5)" } },
  DEFAULT: ["white", 50],
  disabled: [50, 100],
  emphasized: [200, 200],
  inverted: ["black", 800],
  muted: [100, 200],
  panel: ["white", 50],
  popover: ["white", 50],
  subtle: [50, 100],
};

/**
 * Places the inks a page is written in on the neutral ramp.
 */
export const INKS: Steps<"DEFAULT" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: ["black", 900],
  inverted: ["white", "black"],
  muted: [800, 800],
  subtle: [700, 700],
};

/**
 * Places the lines between things on the neutral ramp.
 */
export const LINES: Steps<"DEFAULT" | "emphasized" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [100, 200],
  emphasized: [800, 600],
  inverted: ["white", 50],
  muted: [50, 100],
  subtle: [50, 100],
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
    bg: [50, 50],
    border: [500, 500],
    "border.hover": [600, 600],
    contrast: { value: { _dark: "{colors.gray.dark.black}", base: "{colors.gray.white}" } },
    emphasized: [200, 200],
    fg: [700, 700],
    "fg.muted": [700, 700],
    focusRing: [600, 600],
    muted: [100, 200],
    solid: [600, 600],
    "solid.hover": [700, 700],
    subtle: [50, 100],
  },
  cyan: {
    bg: [50, 950],
    border: [500, 500],
    "border.hover": [600, 400],
    contrast: { value: { _dark: "{colors.gray.dark.black}", base: "{colors.gray.white}" } },
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
    bg: ["white", 50],
    border: [500, 500],
    "border.hover": [600, 600],
    contrast: { value: { _dark: "{colors.gray.dark.black}", base: "{colors.gray.white}" } },
    emphasized: [200, 200],
    fg: [800, 800],
    "fg.muted": [700, 700],
    focusRing: ["black", 900],
    muted: [100, 200],
    solid: ["black", 800],
    "solid.hover": [900, 900],
    subtle: [50, 100],
  },
  green: {
    bg: [50, 50],
    border: [500, 500],
    "border.hover": [600, 600],
    contrast: { value: { _dark: "{colors.gray.dark.black}", base: "{colors.gray.white}" } },
    emphasized: [200, 200],
    fg: [700, 700],
    "fg.muted": [700, 700],
    focusRing: [600, 600],
    muted: [100, 200],
    solid: [600, 500],
    "solid.hover": [700, 600],
    subtle: [50, 100],
  },
  indigo: {
    bg: [50, 700],
    border: [300, 300],
    "border.hover": [400, 200],
    contrast: { value: { _dark: "{colors.gray.dark.white}", base: "{colors.gray.white}" } },
    emphasized: [200, 500],
    fg: [600, 200],
    "fg.muted": [600, 200],
    focusRing: [600, 200],
    muted: [100, 600],
    solid: [600, 300],
    "solid.hover": [700, 300],
    subtle: [50, 700],
  },
  orange: {
    bg: [50, 50],
    border: [500, 500],
    "border.hover": [600, 600],
    contrast: { value: { _dark: "{colors.gray.dark.black}", base: "{colors.gray.white}" } },
    emphasized: [200, 200],
    fg: [700, 700],
    "fg.muted": [700, 700],
    focusRing: [600, 600],
    muted: [100, 200],
    solid: [600, 600],
    "solid.hover": [700, 700],
    subtle: [50, 100],
  },
  pink: {
    bg: [50, 50],
    border: [500, 500],
    "border.hover": [600, 600],
    contrast: { value: { _dark: "{colors.gray.dark.black}", base: "{colors.gray.white}" } },
    emphasized: [200, 200],
    fg: [700, 700],
    "fg.muted": [700, 700],
    focusRing: [600, 600],
    muted: [100, 200],
    solid: [600, 600],
    "solid.hover": [700, 700],
    subtle: [50, 100],
  },
  purple: {
    bg: [50, 50],
    border: [500, 500],
    "border.hover": [600, 600],
    contrast: { value: { _dark: "{colors.gray.dark.black}", base: "{colors.gray.white}" } },
    emphasized: [200, 200],
    fg: [700, 700],
    "fg.muted": [700, 700],
    focusRing: [600, 600],
    muted: [100, 200],
    solid: [600, 600],
    "solid.hover": [700, 700],
    subtle: [50, 100],
  },
  red: {
    bg: [50, 50],
    border: [500, 500],
    "border.hover": [600, 600],
    contrast: { value: { _dark: "{colors.gray.dark.black}", base: "{colors.gray.white}" } },
    emphasized: [200, 300],
    fg: [700, 700],
    "fg.muted": [700, 700],
    focusRing: [600, 600],
    muted: [100, 200],
    solid: [600, 600],
    "solid.hover": [700, 700],
    subtle: [50, 100],
  },
  teal: {
    bg: [50, 50],
    border: [500, 500],
    "border.hover": [600, 600],
    contrast: { value: { _dark: "{colors.gray.dark.black}", base: "{colors.gray.white}" } },
    emphasized: [200, 200],
    fg: [700, 700],
    "fg.muted": [700, 700],
    focusRing: [600, 600],
    muted: [100, 200],
    solid: [600, 600],
    "solid.hover": [700, 700],
    subtle: [50, 100],
  },
  yellow: {
    bg: [50, 50],
    border: [500, 500],
    "border.hover": [600, 600],
    contrast: { value: { _dark: "{colors.gray.dark.black}", base: "{colors.gray.white}" } },
    emphasized: [200, 200],
    fg: [700, 700],
    "fg.muted": [700, 700],
    focusRing: [600, 600],
    muted: [100, 200],
    solid: [600, 600],
    "solid.hover": [700, 700],
    subtle: [50, 100],
  },
};
