/**
 * Lists every ramp Steel draws, keyed by its own steps and read in both modes.
 *
 * @remarks
 *   Each ramp is keyed by its own steps and written from the lightest step to the darkest, so a
 *   role table reads by the step names the ramp is keyed with.
 *   vocabulary.
 */

import { ramp, type Tokens } from "@stealthscale/theme/authoring";

/**
 * Describes the colors a theme states.
 */
type Colors = NonNullable<Tokens["colors"]>;

/**
 * Selects one of the hues Steel draws a ramp for.
 */
export type Ramped =
  | "blue"
  | "cyan"
  | "gray"
  | "green"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "teal"
  | "yellow";

/**
 * Lists every ramp Steel draws, keyed by its own steps and read in both modes.
 */
export const ramps: Readonly<Record<Ramped, Colors>> = {
  blue: ramp(
    [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    [
      "oklch(96.7% 0.0159 253.9)",
      "oklch(90.8% 0.0443 260.0)",
      "oklch(82.8% 0.0861 259.9)",
      "oklch(73.6% 0.1360 261.1)",
      "oklch(64.7% 0.1888 260.6)",
      "oklch(55.7% 0.2430 262.0)",
      "oklch(45.4% 0.2210 262.6)",
      "oklch(36.3% 0.1839 263.1)",
      "oklch(28.0% 0.1403 263.0)",
      "oklch(20.4% 0.0948 262.0)",
    ],
  ),
  cyan: ramp(
    [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    [
      "oklch(96.3% 0.0217 230.5)",
      "oklch(90.2% 0.0571 233.1)",
      "oklch(82.2% 0.1020 237.2)",
      "oklch(72.9% 0.1549 241.7)",
      "oklch(64.1% 0.1623 246.5)",
      "oklch(54.3% 0.1520 249.6)",
      "oklch(44.2% 0.1345 252.6)",
      "oklch(34.7% 0.1035 251.9)",
      "oklch(26.9% 0.0753 250.4)",
      "oklch(19.9% 0.0399 248.5)",
    ],
  ),
  gray: ramp(
    ["white", 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    [
      "oklch(100.0% 0.0000 0.0)",
      "oklch(96.7% 0.0000 0.0)",
      "oklch(90.7% 0.0000 0.0)",
      "oklch(82.7% 0.0000 0.0)",
      "oklch(73.2% 0.0000 0.0)",
      "oklch(64.3% 0.0000 0.0)",
      "oklch(54.2% 0.0000 0.0)",
      "oklch(43.9% 0.0000 0.0)",
      "oklch(34.5% 0.0000 0.0)",
      "oklch(26.9% 0.0000 0.0)",
      "oklch(20.0% 0.0000 0.0)",
    ],
  ),
  green: ramp(
    [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    [
      "oklch(96.1% 0.0411 154.1)",
      "oklch(89.3% 0.1038 152.0)",
      "oklch(81.0% 0.1517 150.4)",
      "oklch(71.2% 0.1677 149.3)",
      "oklch(62.3% 0.1661 148.1)",
      "oklch(52.7% 0.1408 148.3)",
      "oklch(42.9% 0.1165 148.1)",
      "oklch(33.5% 0.0942 147.8)",
      "oklch(26.0% 0.0730 147.7)",
      "oklch(19.2% 0.0414 145.0)",
    ],
  ),
  orange: ramp(
    [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    [
      "oklch(96.9% 0.0194 60.2)",
      "oklch(91.0% 0.0557 57.3)",
      "oklch(83.6% 0.1068 56.0)",
      "oklch(73.8% 0.1770 50.6)",
      "oklch(66.0% 0.1884 45.1)",
      "oklch(55.7% 0.1565 46.0)",
      "oklch(44.7% 0.1256 46.1)",
      "oklch(34.9% 0.0911 50.9)",
      "oklch(26.6% 0.0677 52.8)",
      "oklch(19.7% 0.0447 63.4)",
    ],
  ),
  pink: ramp(
    [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    [
      "oklch(96.9% 0.0185 347.4)",
      "oklch(91.6% 0.0511 349.9)",
      "oklch(84.0% 0.1026 351.7)",
      "oklch(75.6% 0.1672 354.5)",
      "oklch(66.9% 0.1989 357.3)",
      "oklch(57.0% 0.2084 1.0)",
      "oklch(46.5% 0.1723 1.3)",
      "oklch(36.5% 0.1397 3.3)",
      "oklch(28.2% 0.1110 3.1)",
      "oklch(20.5% 0.0562 356.0)",
    ],
  ),
  purple: ramp(
    [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    [
      "oklch(96.8% 0.0177 300.1)",
      "oklch(91.1% 0.0520 302.6)",
      "oklch(83.6% 0.0970 301.2)",
      "oklch(74.9% 0.1531 300.6)",
      "oklch(66.3% 0.2075 298.0)",
      "oklch(57.4% 0.2579 294.9)",
      "oklch(46.8% 0.2189 295.1)",
      "oklch(36.7% 0.1670 294.8)",
      "oklch(28.3% 0.1235 295.6)",
      "oklch(20.7% 0.0635 298.9)",
    ],
  ),
  red: ramp(
    [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    [
      "oklch(96.9% 0.0151 17.4)",
      "oklch(91.3% 0.0448 14.6)",
      "oklch(84.0% 0.0890 14.8)",
      "oklch(75.1% 0.1508 18.4)",
      "oklch(66.6% 0.2088 22.1)",
      "oklch(56.9% 0.2174 25.9)",
      "oklch(46.0% 0.1708 25.6)",
      "oklch(36.3% 0.1355 25.5)",
      "oklch(28.0% 0.1084 25.7)",
      "oklch(20.2% 0.0625 21.6)",
    ],
  ),
  teal: ramp(
    [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    [
      "oklch(96.4% 0.0351 196.6)",
      "oklch(90.3% 0.0798 195.8)",
      "oklch(81.3% 0.1262 193.7)",
      "oklch(72.2% 0.1229 192.7)",
      "oklch(62.9% 0.1079 192.4)",
      "oklch(53.2% 0.0917 190.8)",
      "oklch(43.3% 0.0739 194.8)",
      "oklch(34.1% 0.0580 200.0)",
      "oklch(26.5% 0.0438 207.2)",
      "oklch(20.3% 0.0242 204.9)",
    ],
  ),
  yellow: ramp(
    [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    [
      "oklch(96.6% 0.0401 94.7)",
      "oklch(90.0% 0.1384 93.4)",
      "oklch(83.2% 0.1655 90.4)",
      "oklch(73.4% 0.1493 86.5)",
      "oklch(64.5% 0.1322 85.2)",
      "oklch(54.6% 0.1119 85.0)",
      "oklch(43.9% 0.0899 86.4)",
      "oklch(34.6% 0.0707 89.4)",
      "oklch(26.7% 0.0545 89.9)",
      "oklch(19.9% 0.0407 93.2)",
    ],
  ),
};
