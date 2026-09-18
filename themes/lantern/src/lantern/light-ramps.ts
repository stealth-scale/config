/**
 * Lists every ramp Lantern draws in light mode, keyed by its own steps.
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
 * Selects one of the hues Lantern draws a ramp for.
 */
export type Ramped =
  | "blue"
  | "cyan"
  | "gray"
  | "green"
  | "indigo"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "yellow";

/**
 * Lists every ramp Lantern draws in light mode, keyed by its own steps.
 */
export const lightRamps: Readonly<Record<Ramped, Colors>> = {
  blue: ramp(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [
      "oklch(96.0% 0.0210 241.3)",
      "oklch(89.0% 0.0586 243.0)",
      "oklch(81.9% 0.0956 247.3)",
      "oklch(74.6% 0.1348 251.8)",
      "oklch(67.3% 0.1760 255.3)",
      "oklch(59.9% 0.2194 259.0)",
      "oklch(50.4% 0.2095 261.0)",
      "oklch(41.8% 0.1933 262.0)",
      "oklch(34.4% 0.1646 262.4)",
      "oklch(27.3% 0.1321 262.6)",
    ],
  ),
  cyan: ramp(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [
      "oklch(98.1% 0.0265 185.2)",
      "oklch(92.5% 0.0653 185.4)",
      "oklch(86.8% 0.0933 187.1)",
      "oklch(81.9% 0.1125 189.5)",
      "oklch(77.7% 0.1226 190.9)",
      "oklch(73.8% 0.1238 194.8)",
      "oklch(61.5% 0.1034 199.0)",
      "oklch(48.7% 0.0831 203.7)",
      "oklch(36.4% 0.0625 207.6)",
      "oklch(23.5% 0.0408 211.3)",
    ],
  ),
  gray: ramp(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [
      "oklch(100.0% 0.0000 0.0)",
      "oklch(98.5% 0.0000 0.0)",
      "oklch(97.0% 0.0000 0.0)",
      "oklch(95.5% 0.0000 0.0)",
      "oklch(88.5% 0.0000 0.0)",
      "oklch(80.5% 0.0000 0.0)",
      "oklch(64.0% 0.0000 0.0)",
      "oklch(46.4% 0.0000 0.0)",
      "oklch(23.9% 0.0000 0.0)",
      "oklch(0.0% 0.0000 0.0)",
    ],
  ),
  green: ramp(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [
      "oklch(98.8% 0.0254 128.7)",
      "oklch(94.0% 0.0811 130.4)",
      "oklch(88.3% 0.1314 132.5)",
      "oklch(82.6% 0.1719 134.4)",
      "oklch(77.4% 0.2017 136.5)",
      "oklch(72.6% 0.2182 138.5)",
      "oklch(61.5% 0.1912 139.4)",
      "oklch(50.2% 0.1597 140.0)",
      "oklch(38.4% 0.1241 140.2)",
      "oklch(25.4% 0.0803 139.1)",
    ],
  ),
  indigo: ramp(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [
      "oklch(96.9% 0.0144 264.5)",
      "oklch(91.7% 0.0399 263.7)",
      "oklch(82.8% 0.0851 266.2)",
      "oklch(73.6% 0.1357 268.1)",
      "oklch(62.8% 0.1852 268.0)",
      "oklch(52.2% 0.2301 266.8)",
      "oklch(43.3% 0.2155 266.7)",
      "oklch(35.3% 0.1941 266.4)",
      "oklch(27.8% 0.1663 265.9)",
      "oklch(21.3% 0.1275 266.1)",
    ],
  ),
  orange: ramp(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [
      "oklch(97.8% 0.0239 85.8)",
      "oklch(93.6% 0.0638 83.1)",
      "oklch(89.4% 0.0975 79.1)",
      "oklch(84.8% 0.1268 73.5)",
      "oklch(80.2% 0.1530 67.2)",
      "oklch(74.4% 0.1724 58.5)",
      "oklch(64.0% 0.1596 53.3)",
      "oklch(53.7% 0.1437 49.1)",
      "oklch(44.2% 0.1225 46.9)",
      "oklch(34.8% 0.0978 46.0)",
    ],
  ),
  pink: ramp(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [
      "oklch(96.9% 0.0179 351.1)",
      "oklch(91.6% 0.0506 351.3)",
      "oklch(83.7% 0.1059 351.0)",
      "oklch(76.9% 0.1612 351.2)",
      "oklch(69.6% 0.2078 351.7)",
      "oklch(63.4% 0.2345 353.2)",
      "oklch(54.9% 0.2123 351.6)",
      "oklch(46.7% 0.1855 350.1)",
      "oklch(38.2% 0.1552 348.7)",
      "oklch(29.4% 0.1207 345.7)",
    ],
  ),
  purple: ramp(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [
      "oklch(96.6% 0.0220 312.2)",
      "oklch(91.9% 0.0527 310.1)",
      "oklch(80.7% 0.1095 307.5)",
      "oklch(69.2% 0.1608 304.8)",
      "oklch(58.4% 0.2024 301.0)",
      "oklch(49.4% 0.2284 295.6)",
      "oklch(40.9% 0.2021 291.9)",
      "oklch(33.0% 0.1715 288.7)",
      "oklch(25.2% 0.1353 285.5)",
      "oklch(18.0% 0.0946 286.4)",
    ],
  ),
  red: ramp(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [
      "oklch(96.9% 0.0152 22.4)",
      "oklch(88.8% 0.0586 24.8)",
      "oklch(80.6% 0.1102 23.2)",
      "oklch(73.1% 0.1655 23.3)",
      "oklch(67.3% 0.2143 24.5)",
      "oklch(62.1% 0.2381 26.1)",
      "oklch(54.3% 0.2132 25.9)",
      "oklch(46.3% 0.1845 25.2)",
      "oklch(38.2% 0.1547 23.9)",
      "oklch(30.0% 0.1207 20.7)",
    ],
  ),
  yellow: ramp(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [
      "oklch(98.6% 0.0278 98.1)",
      "oklch(95.6% 0.0743 95.9)",
      "oklch(92.5% 0.1095 93.2)",
      "oklch(89.0% 0.1375 89.2)",
      "oklch(85.4% 0.1572 84.1)",
      "oklch(80.2% 0.1651 76.0)",
      "oklch(68.9% 0.1480 70.1)",
      "oklch(58.1% 0.1293 65.9)",
      "oklch(47.8% 0.1089 63.2)",
      "oklch(37.4% 0.0869 61.1)",
    ],
  ),
};
