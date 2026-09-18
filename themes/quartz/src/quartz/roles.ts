/**
 * Places every role on Quartz's own steps: the surfaces, the inks and the lines on the neutral
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
  backdrop: { value: { _dark: "rgba(0, 0, 0, 0.5)", base: "rgba(0, 0, 0, 0.4)" } },
  DEFAULT: ["white", 16],
  disabled: [94, 8],
  emphasized: [94, 22],
  inverted: [16, "white"],
  muted: [96, 20],
  panel: ["white", 16],
  popover: ["white", 16],
  subtle: [98, 18],
};

/**
 * Places the inks a page is written in on the neutral ramp.
 */
export const INKS: Steps<"DEFAULT" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [14, "white"],
  inverted: ["white", 14],
  muted: [26, 84],
  subtle: [44, 60],
};

/**
 * Places the lines between things on the neutral ramp.
 */
export const LINES: Steps<"DEFAULT" | "emphasized" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [82, 40],
  emphasized: [38, 68],
  inverted: [80, 42],
  muted: [88, 32],
  subtle: [94, 24],
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
    bg: [160, 10],
    border: [90, 90],
    "border.hover": [80, 100],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: [130, 50],
    fg: [40, 130],
    "fg.muted": [50, 120],
    focusRing: [80, 100],
    muted: [150, 40],
    solid: [80, 90],
    "solid.hover": [70, 100],
    subtle: [160, 20],
  },
  cyan: {
    bg: ["tint60", "shade50"],
    border: ["primary", "shade10"],
    "border.hover": ["shade10", "primary"],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.black}" } },
    emphasized: ["tint30", "shade30"],
    fg: ["shade50", "tint50"],
    "fg.muted": ["shade40", "tint40"],
    focusRing: ["shade10", "tint20"],
    muted: ["tint40", "shade50"],
    solid: ["primary", "primary"],
    "solid.hover": ["shade10", "tint10"],
    subtle: ["tint60", "shade40"],
  },
  gray: {
    bg: ["white", 16],
    border: [58, 46],
    "border.hover": [56, 48],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: [88, 28],
    fg: [26, 84],
    "fg.muted": [38, 82],
    focusRing: [38, 68],
    muted: [92, 26],
    solid: [16, "white"],
    "solid.hover": [14, 98],
    subtle: [96, 24],
  },
  green: {
    bg: ["tint60", "shade50"],
    border: ["tint20", "tint10"],
    "border.hover": ["tint10", "tint20"],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: ["tint30", "shade20"],
    fg: ["shade50", "tint50"],
    "fg.muted": ["shade40", "tint40"],
    focusRing: ["primary", "tint20"],
    muted: ["tint40", "shade30"],
    solid: ["primary", "tint10"],
    "solid.hover": ["shade10", "tint20"],
    subtle: ["tint60", "shade40"],
  },
  indigo: {
    bg: [50, 950],
    border: [500, 500],
    "border.hover": [600, 400],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
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
    bg: ["tint60", "shade50"],
    border: ["primary", "shade10"],
    "border.hover": ["shade10", "primary"],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.black}" } },
    emphasized: ["tint30", "shade30"],
    fg: ["shade50", "tint50"],
    "fg.muted": ["shade40", "tint40"],
    focusRing: ["shade10", "tint20"],
    muted: ["tint40", "shade50"],
    solid: ["primary", "primary"],
    "solid.hover": ["shade10", "tint10"],
    subtle: ["tint60", "shade40"],
  },
  pink: {
    bg: ["tint60", "shade50"],
    border: ["tint10", "shade10"],
    "border.hover": ["primary", "primary"],
    contrast: { value: { _dark: "{colors.gray.white}", base: "{colors.gray.white}" } },
    emphasized: ["tint30", "shade20"],
    fg: ["shade50", "tint60"],
    "fg.muted": ["shade40", "tint50"],
    focusRing: ["primary", "tint20"],
    muted: ["tint40", "shade30"],
    solid: ["shade10", "shade10"],
    "solid.hover": ["shade20", "shade20"],
    subtle: ["tint60", "shade40"],
  },
  purple: {
    bg: ["tint60", "shade50"],
    border: ["tint30", "tint30"],
    "border.hover": ["tint20", "tint40"],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: ["tint30", "shade20"],
    fg: ["shade50", "tint50"],
    "fg.muted": ["shade40", "tint40"],
    focusRing: ["primary", "tint40"],
    muted: ["tint40", "shade30"],
    solid: ["primary", "tint30"],
    "solid.hover": ["shade10", "tint40"],
    subtle: ["tint60", "shade40"],
  },
  red: {
    bg: ["tint60", "shade50"],
    border: ["tint30", "tint20"],
    "border.hover": ["tint20", "tint30"],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: ["tint30", "shade20"],
    fg: ["shade50", "tint50"],
    "fg.muted": ["shade40", "tint40"],
    focusRing: ["primary", "tint30"],
    muted: ["tint40", "shade30"],
    solid: ["primary", "tint20"],
    "solid.hover": ["shade10", "tint30"],
    subtle: ["tint60", "shade40"],
  },
  teal: {
    bg: ["tint60", "shade50"],
    border: ["tint20", "primary"],
    "border.hover": ["tint10", "tint10"],
    contrast: { value: { _dark: "{colors.gray.white}", base: "{colors.gray.white}" } },
    emphasized: ["tint30", "shade20"],
    fg: ["shade50", "tint60"],
    "fg.muted": ["shade40", "tint50"],
    focusRing: ["primary", "tint20"],
    muted: ["tint40", "shade30"],
    solid: ["primary", "primary"],
    "solid.hover": ["shade10", "shade10"],
    subtle: ["tint60", "shade40"],
  },
  yellow: {
    bg: ["tint60", "shade50"],
    border: ["shade30", "shade30"],
    "border.hover": ["shade40", "shade20"],
    contrast: { value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" } },
    emphasized: ["tint30", "shade50"],
    fg: ["shade50", "tint30"],
    "fg.muted": ["shade40", "tint10"],
    focusRing: ["shade30", "tint20"],
    muted: ["tint40", "shade50"],
    solid: ["shade30", "primary"],
    "solid.hover": ["shade40", "tint20"],
    subtle: ["tint60", "shade40"],
  },
};
