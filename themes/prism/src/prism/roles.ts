/**
 * Places every role on Prism's own steps: the surfaces, the inks and the lines on the neutral
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
  backdrop: { value: { _dark: "rgba(0, 0, 0, 0.6)", base: "rgba(0, 0, 0, 0.4)" } },
  DEFAULT: [25, 25],
  disabled: [100, 100],
  emphasized: [200, 300],
  inverted: [800, 800],
  muted: [100, 200],
  panel: [25, 75],
  popover: [25, 75],
  subtle: [50, 50],
};

/**
 * Places the inks a page is written in on the neutral ramp.
 */
export const INKS: Steps<"DEFAULT" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [800, 800],
  inverted: [25, 25],
  muted: [700, 700],
  subtle: [600, 600],
};

/**
 * Places the lines between things on the neutral ramp.
 */
export const LINES: Steps<"DEFAULT" | "emphasized" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [300, 300],
  emphasized: [600, 600],
  inverted: [25, 25],
  muted: [100, 100],
  subtle: [50, 50],
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
    bg: [100, 100],
    border: [800, 800],
    "border.hover": [900, 900],
    contrast: { value: { _dark: "{colors.gray.dark.1000}", base: "{colors.gray.25}" } },
    emphasized: [400, 500],
    fg: [1200, 1300],
    "fg.muted": [1100, 1200],
    focusRing: [800, 900],
    muted: [300, 400],
    solid: [900, 800],
    "solid.hover": [1000, 700],
    subtle: [200, 300],
  },
  cyan: {
    bg: [100, 100],
    border: [800, 800],
    "border.hover": [900, 900],
    contrast: { value: { _dark: "{colors.gray.dark.1000}", base: "{colors.gray.25}" } },
    emphasized: [400, 500],
    fg: [1200, 1300],
    "fg.muted": [1100, 1200],
    focusRing: [800, 900],
    muted: [300, 400],
    solid: [900, 800],
    "solid.hover": [1000, 700],
    subtle: [200, 300],
  },
  gray: {
    bg: [25, 25],
    border: [500, 500],
    "border.hover": [600, 600],
    contrast: { value: { _dark: "{colors.gray.dark.25}", base: "{colors.gray.25}" } },
    emphasized: [200, 300],
    fg: [800, 800],
    "fg.muted": [700, 700],
    focusRing: [600, 600],
    muted: [100, 200],
    solid: [800, 800],
    "solid.hover": [900, 900],
    subtle: [50, 50],
  },
  green: {
    bg: [100, 100],
    border: [800, 800],
    "border.hover": [900, 900],
    contrast: { value: { _dark: "{colors.gray.dark.1000}", base: "{colors.gray.25}" } },
    emphasized: [400, 500],
    fg: [1200, 1300],
    "fg.muted": [1100, 1200],
    focusRing: [800, 900],
    muted: [300, 400],
    solid: [900, 800],
    "solid.hover": [1000, 700],
    subtle: [200, 300],
  },
  indigo: {
    bg: [100, 100],
    border: [800, 800],
    "border.hover": [900, 900],
    contrast: { value: { _dark: "{colors.gray.dark.1000}", base: "{colors.gray.25}" } },
    emphasized: [400, 500],
    fg: [1200, 1300],
    "fg.muted": [1100, 1200],
    focusRing: [800, 900],
    muted: [300, 400],
    solid: [900, 800],
    "solid.hover": [1000, 700],
    subtle: [200, 300],
  },
  orange: {
    bg: [100, 100],
    border: [800, 800],
    "border.hover": [900, 900],
    contrast: { value: { _dark: "{colors.gray.dark.1000}", base: "{colors.gray.25}" } },
    emphasized: [400, 500],
    fg: [1200, 1300],
    "fg.muted": [1100, 1200],
    focusRing: [800, 900],
    muted: [300, 400],
    solid: [900, 800],
    "solid.hover": [1000, 700],
    subtle: [200, 300],
  },
  pink: {
    bg: [100, 100],
    border: [800, 800],
    "border.hover": [900, 900],
    contrast: { value: { _dark: "{colors.gray.dark.1000}", base: "{colors.gray.25}" } },
    emphasized: [400, 500],
    fg: [1200, 1300],
    "fg.muted": [1100, 1200],
    focusRing: [800, 900],
    muted: [300, 400],
    solid: [900, 800],
    "solid.hover": [1000, 700],
    subtle: [200, 300],
  },
  purple: {
    bg: [100, 100],
    border: [800, 800],
    "border.hover": [900, 900],
    contrast: { value: { _dark: "{colors.gray.dark.1000}", base: "{colors.gray.25}" } },
    emphasized: [400, 500],
    fg: [1200, 1300],
    "fg.muted": [1100, 1200],
    focusRing: [800, 900],
    muted: [300, 400],
    solid: [900, 800],
    "solid.hover": [1000, 700],
    subtle: [200, 300],
  },
  red: {
    bg: [100, 100],
    border: [800, 800],
    "border.hover": [900, 900],
    contrast: { value: { _dark: "{colors.gray.dark.1000}", base: "{colors.gray.25}" } },
    emphasized: [400, 500],
    fg: [1200, 1300],
    "fg.muted": [1100, 1200],
    focusRing: [800, 900],
    muted: [300, 400],
    solid: [900, 800],
    "solid.hover": [1000, 700],
    subtle: [200, 300],
  },
  teal: {
    bg: [100, 100],
    border: [800, 800],
    "border.hover": [900, 900],
    contrast: { value: { _dark: "{colors.gray.dark.1000}", base: "{colors.gray.25}" } },
    emphasized: [400, 500],
    fg: [1200, 1300],
    "fg.muted": [1100, 1200],
    focusRing: [800, 900],
    muted: [300, 400],
    solid: [900, 800],
    "solid.hover": [1000, 700],
    subtle: [200, 300],
  },
  yellow: {
    bg: [100, 100],
    border: [800, 800],
    "border.hover": [900, 900],
    contrast: { value: { _dark: "{colors.gray.dark.1000}", base: "{colors.gray.25}" } },
    emphasized: [400, 500],
    fg: [1200, 1300],
    "fg.muted": [1100, 1200],
    focusRing: [800, 900],
    muted: [300, 400],
    solid: [900, 800],
    "solid.hover": [1000, 700],
    subtle: [200, 300],
  },
};
