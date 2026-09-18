/**
 * Lists every ramp Graphite draws in light mode, keyed by its own steps.
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
 * Selects one of the hues Graphite draws a ramp for.
 */
export type Ramped = "blue" | "gray" | "green" | "orange" | "pink" | "purple" | "red" | "yellow";

/**
 * Lists every ramp Graphite draws in light mode, keyed by its own steps.
 */
export const lightRamps: Readonly<Record<Ramped, Colors>> = {
  blue: ramp(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [
      "oklch(95.4% 0.0284 228.0)",
      "oklch(89.3% 0.0606 235.7)",
      "oklch(81.5% 0.1045 239.2)",
      "oklch(73.1% 0.1462 248.3)",
      "oklch(64.2% 0.1951 255.0)",
      "oklch(54.0% 0.1906 257.5)",
      "oklch(45.1% 0.1641 258.2)",
      "oklch(37.9% 0.1412 258.7)",
      "oklch(32.1% 0.1084 259.1)",
      "oklch(26.3% 0.1022 259.0)",
    ],
  ),
  gray: ramp(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    [
      "oklch(100.0% 0.0000 0.0)",
      "oklch(97.8% 0.0034 247.9)",
      "oklch(96.0% 0.0052 247.9)",
      "oklch(93.5% 0.0080 253.9)",
      "oklch(92.2% 0.0094 242.8)",
      "oklch(90.4% 0.0116 252.1)",
      "oklch(88.1% 0.0130 244.3)",
      "oklch(85.6% 0.0159 248.0)",
      "oklch(63.3% 0.0228 255.0)",
      "oklch(49.5% 0.0215 250.8)",
      "oklch(41.3% 0.0162 251.7)",
      "oklch(36.5% 0.0145 252.3)",
      "oklch(27.9% 0.0109 254.0)",
      "oklch(25.4% 0.0111 254.0)",
    ],
  ),
  green: ramp(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [
      "oklch(95.7% 0.0487 151.6)",
      "oklch(89.1% 0.0964 151.1)",
      "oklch(81.2% 0.1540 150.1)",
      "oklch(72.6% 0.1643 149.5)",
      "oklch(63.4% 0.1620 148.4)",
      "oklch(52.4% 0.1401 148.0)",
      "oklch(43.9% 0.1179 148.1)",
      "oklch(37.4% 0.1042 148.5)",
      "oklch(31.4% 0.0881 149.3)",
      "oklch(26.0% 0.0698 151.1)",
    ],
  ),
  orange: ramp(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [
      "oklch(96.6% 0.0220 63.2)",
      "oklch(90.7% 0.0635 63.8)",
      "oklch(83.4% 0.1125 59.7)",
      "oklch(75.3% 0.1573 52.4)",
      "oklch(66.5% 0.1638 48.8)",
      "oklch(55.7% 0.1601 44.7)",
      "oklch(46.6% 0.1371 43.3)",
      "oklch(39.5% 0.1146 44.2)",
      "oklch(33.4% 0.0949 45.4)",
      "oklch(27.7% 0.0809 43.8)",
    ],
  ),
  pink: ramp(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [
      "oklch(96.7% 0.0201 345.7)",
      "oklch(91.1% 0.0580 344.3)",
      "oklch(84.0% 0.1106 345.7)",
      "oklch(76.5% 0.1734 346.9)",
      "oklch(67.6% 0.1953 347.5)",
      "oklch(56.5% 0.1871 348.0)",
      "oklch(47.7% 0.1641 347.1)",
      "oklch(40.1% 0.1343 346.0)",
      "oklch(34.2% 0.1236 344.8)",
      "oklch(28.3% 0.1157 345.2)",
    ],
  ),
  purple: ramp(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [
      "oklch(96.6% 0.0246 317.7)",
      "oklch(91.0% 0.0565 308.3)",
      "oklch(83.6% 0.1012 304.5)",
      "oklch(75.6% 0.1508 302.0)",
      "oklch(66.9% 0.1902 297.4)",
      "oklch(56.3% 0.2069 295.0)",
      "oklch(47.4% 0.1908 293.8)",
      "oklch(40.2% 0.1668 293.9)",
      "oklch(34.0% 0.1430 292.9)",
      "oklch(28.3% 0.1259 291.7)",
    ],
  ),
  red: ramp(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [
      "oklch(95.5% 0.0220 24.4)",
      "oklch(89.3% 0.0558 22.3)",
      "oklch(82.2% 0.0996 21.7)",
      "oklch(74.6% 0.1536 21.0)",
      "oklch(65.7% 0.2170 24.4)",
      "oklch(55.2% 0.2051 24.5)",
      "oklch(45.9% 0.1777 21.9)",
      "oklch(38.7% 0.1507 20.8)",
      "oklch(32.3% 0.1296 18.4)",
      "oklch(26.5% 0.1059 14.7)",
    ],
  ),
  yellow: ramp(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [
      "oklch(97.2% 0.0658 101.0)",
      "oklch(91.0% 0.1235 95.7)",
      "oklch(83.4% 0.1401 91.5)",
      "oklch(75.0% 0.1407 87.1)",
      "oklch(66.2% 0.1374 79.3)",
      "oklch(55.4% 0.1169 75.0)",
      "oklch(46.6% 0.1009 70.2)",
      "oklch(39.4% 0.0852 68.9)",
      "oklch(33.0% 0.0722 68.3)",
      "oklch(28.0% 0.0602 71.5)",
    ],
  ),
};
