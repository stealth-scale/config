/**
 * Places every role on Compass's own steps: the surfaces, the inks and the lines on the neutral
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
  backdrop: { value: { _dark: "#050C1F75", base: "#050C1F75" } },
  DEFAULT: [0, 100],
  disabled: [200, 300],
  emphasized: [300, 300],
  inverted: [1000, 1000],
  muted: [200, 250],
  panel: [0, 200],
  popover: [0, 250],
  subtle: [100, 200],
};

/**
 * Places the inks a page is written in on the neutral ramp.
 */
export const INKS: Steps<"DEFAULT" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [1000, 1000],
  inverted: [0, 100],
  muted: [800, 800],
  subtle: [700, 700],
};

/**
 * Places the lines between things on the neutral ramp.
 */
export const LINES: Steps<"DEFAULT" | "emphasized" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [300, 300],
  emphasized: [700, 600],
  inverted: [0, 0],
  muted: [200, 250],
  subtle: [100, 200],
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
    bg: [100, 1000],
    border: [500, 700],
    "border.hover": [600, 600],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [400, 800],
    fg: [1000, 100],
    "fg.muted": [900, 200],
    focusRing: [700, 300],
    muted: [200, 900],
    solid: [700, 400],
    "solid.hover": [800, 300],
    subtle: [100, 1000],
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
    bg: [0, 1200],
    border: [500, 600],
    "border.hover": [600, 700],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [500, 400],
    fg: [1200, 1000],
    "fg.muted": [1100, 900],
    focusRing: [700, 600],
    muted: [300, 350],
    solid: [700, 700],
    "solid.hover": [800, 800],
    subtle: [200, 300],
  },
  green: {
    bg: [100, 1000],
    border: [600, 700],
    "border.hover": [700, 600],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [400, 800],
    fg: [1000, 100],
    "fg.muted": [900, 200],
    focusRing: [700, 500],
    muted: [200, 900],
    solid: [700, 400],
    "solid.hover": [800, 300],
    subtle: [100, 1000],
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
    bg: [100, 1000],
    border: [600, 700],
    "border.hover": [700, 600],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [400, 800],
    fg: [1000, 100],
    "fg.muted": [900, 200],
    focusRing: [700, 500],
    muted: [200, 900],
    solid: [700, 400],
    "solid.hover": [800, 300],
    subtle: [100, 1000],
  },
  pink: {
    bg: [100, 1000],
    border: [500, 700],
    "border.hover": [600, 600],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [400, 800],
    fg: [1000, 100],
    "fg.muted": [900, 200],
    focusRing: [700, 500],
    muted: [200, 900],
    solid: [700, 400],
    "solid.hover": [800, 300],
    subtle: [100, 1000],
  },
  purple: {
    bg: [100, 1000],
    border: [500, 700],
    "border.hover": [600, 600],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [400, 800],
    fg: [1000, 100],
    "fg.muted": [900, 200],
    focusRing: [700, 500],
    muted: [200, 900],
    solid: [700, 400],
    "solid.hover": [800, 300],
    subtle: [100, 1000],
  },
  red: {
    bg: [100, 1000],
    border: [500, 700],
    "border.hover": [600, 600],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [400, 800],
    fg: [1000, 100],
    "fg.muted": [900, 200],
    focusRing: [700, 500],
    muted: [200, 900],
    solid: [700, 400],
    "solid.hover": [800, 300],
    subtle: [100, 1000],
  },
  teal: {
    bg: [100, 1000],
    border: [600, 700],
    "border.hover": [700, 600],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [400, 800],
    fg: [1000, 100],
    "fg.muted": [900, 200],
    focusRing: [700, 500],
    muted: [200, 900],
    solid: [700, 400],
    "solid.hover": [800, 300],
    subtle: [100, 1000],
  },
  yellow: {
    bg: [100, 1000],
    border: [600, 700],
    "border.hover": [700, 600],
    contrast: { value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" } },
    emphasized: [300, 800],
    fg: [900, 100],
    "fg.muted": [850, 200],
    focusRing: [700, 500],
    muted: [200, 900],
    solid: [700, 400],
    "solid.hover": [800, 300],
    subtle: [100, 1000],
  },
};
