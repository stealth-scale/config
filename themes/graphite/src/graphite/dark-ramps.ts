/**
 * Lists every ramp Graphite draws in dark mode, keyed by its own steps.
 *
 * @remarks
 *   Each ramp is keyed by its own steps and written from the lightest step to the darkest, so a
 *   role table reads by the step names the ramp is keyed with.
 *   vocabulary.
 */

import { ramp, type Tokens } from "@stealthscale/theme/authoring";

import { type Ramped } from "#graphite/light-ramps.ts";

/**
 * Describes the colors a theme states.
 */
type Colors = NonNullable<Tokens["colors"]>;

/**
 * Lists every ramp Graphite draws in dark mode, keyed by its own steps.
 */
export const darkRamps: Readonly<Record<Ramped, Colors>> = {
  blue: ramp(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "tint"],
    [
      "oklch(91.6% 0.0447 241.1)",
      "oklch(85.6% 0.0768 244.1)",
      "oklch(78.6% 0.1153 246.7)",
      "oklch(71.5% 0.1518 253.3)",
      "oklch(64.6% 0.1876 257.4)",
      "oklch(56.9% 0.2023 259.7)",
      "oklch(49.0% 0.1857 260.1)",
      "oklch(40.5% 0.1591 261.2)",
      "oklch(31.6% 0.1150 261.5)",
      "oklch(24.8% 0.0939 261.7)",
      "oklch(22.9% 0.0374 257.2)",
    ],
  ),
  gray: ramp(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, "tint"],
    [
      "oklch(10.4% 0.0194 248.3)",
      "oklch(17.6% 0.0140 258.4)",
      "oklch(22.0% 0.0182 255.7)",
      "oklch(27.4% 0.0179 251.9)",
      "oklch(29.2% 0.0202 260.6)",
      "oklch(31.1% 0.0221 259.4)",
      "oklch(33.4% 0.0223 256.4)",
      "oklch(38.4% 0.0179 254.7)",
      "oklch(52.9% 0.0179 257.2)",
      "oklch(67.7% 0.0155 254.6)",
      "oklch(79.7% 0.0169 262.7)",
      "oklch(87.7% 0.0140 258.3)",
      "oklch(97.0% 0.0103 247.9)",
      "oklch(100.0% 0.0000 0.0)",
      "oklch(25.5% 0.0145 261.7)",
    ],
  ),
  green: ramp(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "tint"],
    [
      "oklch(90.7% 0.1123 146.3)",
      "oklch(84.2% 0.1641 145.8)",
      "oklch(77.2% 0.1880 145.5)",
      "oklch(69.5% 0.1809 145.6)",
      "oklch(62.2% 0.1661 146.2)",
      "oklch(54.6% 0.1474 146.3)",
      "oklch(46.8% 0.1231 147.6)",
      "oklch(38.9% 0.1019 148.4)",
      "oklch(30.5% 0.0826 149.3)",
      "oklch(23.7% 0.0584 150.5)",
      "oklch(24.9% 0.0305 166.4)",
    ],
  ),
  orange: ramp(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "tint"],
    [
      "oklch(92.0% 0.0641 73.7)",
      "oklch(86.3% 0.1089 71.3)",
      "oklch(79.9% 0.1412 60.1)",
      "oklch(72.7% 0.1534 52.8)",
      "oklch(65.4% 0.1582 48.4)",
      "oklch(57.4% 0.1483 45.3)",
      "oklch(49.1% 0.1310 43.5)",
      "oklch(39.7% 0.1115 42.0)",
      "oklch(32.4% 0.0956 41.8)",
      "oklch(25.2% 0.0729 44.2)",
      "oklch(22.7% 0.0129 26.5)",
    ],
  ),
  pink: ramp(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "tint"],
    [
      "oklch(92.4% 0.0470 347.2)",
      "oklch(86.9% 0.0840 348.8)",
      "oklch(80.7% 0.1333 348.6)",
      "oklch(73.9% 0.1709 349.7)",
      "oklch(66.2% 0.1680 349.5)",
      "oklch(58.5% 0.1632 349.6)",
      "oklch(50.0% 0.1508 349.5)",
      "oklch(41.6% 0.1338 349.2)",
      "oklch(33.0% 0.1192 349.8)",
      "oklch(25.7% 0.0967 349.6)",
      "oklch(23.0% 0.0263 317.6)",
    ],
  ),
  purple: ramp(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "tint"],
    [
      "oklch(92.3% 0.0470 306.0)",
      "oklch(86.7% 0.0845 307.4)",
      "oklch(80.1% 0.1275 305.9)",
      "oklch(73.9% 0.1626 301.9)",
      "oklch(68.8% 0.1781 298.9)",
      "oklch(58.4% 0.2053 295.6)",
      "oklch(50.4% 0.2002 293.3)",
      "oklch(41.6% 0.1606 294.7)",
      "oklch(32.8% 0.1329 294.7)",
      "oklch(25.5% 0.1114 292.6)",
      "oklch(26.4% 0.0444 290.7)",
    ],
  ),
  red: ramp(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "tint"],
    [
      "oklch(92.2% 0.0397 27.5)",
      "oklch(86.5% 0.0724 26.0)",
      "oklch(80.1% 0.1134 25.8)",
      "oklch(73.4% 0.1626 25.8)",
      "oklch(66.5% 0.2046 27.0)",
      "oklch(58.6% 0.2011 26.8)",
      "oklch(50.5% 0.1826 26.5)",
      "oklch(41.8% 0.1549 26.0)",
      "oklch(32.8% 0.1273 25.9)",
      "oklch(25.7% 0.1020 28.5)",
      "oklch(22.7% 0.0220 358.8)",
    ],
  ),
  yellow: ramp(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "tint"],
    [
      "oklch(91.8% 0.0868 92.5)",
      "oklch(85.7% 0.1331 90.0)",
      "oklch(79.0% 0.1386 85.2)",
      "oklch(72.0% 0.1401 79.9)",
      "oklch(64.4% 0.1333 75.9)",
      "oklch(56.5% 0.1184 74.9)",
      "oklch(48.6% 0.1032 69.7)",
      "oklch(40.6% 0.0898 67.0)",
      "oklch(31.8% 0.0719 64.2)",
      "oklch(24.9% 0.0569 62.6)",
      "oklch(25.4% 0.0240 89.4)",
    ],
  ),
};
