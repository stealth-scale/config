/**
 * Lists every ramp Quartz draws, keyed by its own steps and read in both modes.
 *
 * @remarks
 *   Each ramp is keyed by its own steps and written from the lightest step to the darkest, so a
 *   role table reads by the step names the ramp is keyed with.
 *   vocabulary.
 */

import { ramp, type Tokens } from "@stealthscale/theme/authoring";

import { grayRamp } from "#quartz/gray-ramp.ts";

/**
 * Describes the colors a theme states.
 */
type Colors = NonNullable<Tokens["colors"]>;

/**
 * Selects one of the hues Quartz draws a ramp for.
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
 * Lists every ramp Quartz draws, keyed by its own steps and read in both modes.
 */
export const ramps: Readonly<Record<Ramped, Colors>> = {
  blue: ramp(
    [160, 150, 140, 130, 120, 110, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10],
    [
      "oklch(96.1% 0.0148 251.2)",
      "oklch(91.0% 0.0376 249.5)",
      "oklch(86.3% 0.0620 250.0)",
      "oklch(81.2% 0.0897 250.9)",
      "oklch(76.2% 0.1136 249.5)",
      "oklch(72.5% 0.1309 250.4)",
      "oklch(68.6% 0.1534 251.1)",
      "oklch(61.1% 0.1581 251.2)",
      "oklch(52.6% 0.1493 251.6)",
      "oklch(47.6% 0.1310 251.4)",
      "oklch(43.6% 0.1123 249.1)",
      "oklch(38.8% 0.0961 248.4)",
      "oklch(34.1% 0.0783 246.1)",
      "oklch(29.2% 0.0649 246.4)",
      "oklch(24.8% 0.0515 245.6)",
      "oklch(19.7% 0.0351 243.3)",
    ],
  ),
  cyan: ramp(
    [
      "tint60",
      "tint50",
      "tint40",
      "tint30",
      "tint20",
      "tint10",
      "primary",
      "shade10",
      "shade20",
      "shade30",
      "shade40",
      "shade50",
    ],
    [
      "oklch(98.0% 0.0089 214.3)",
      "oklch(92.5% 0.0348 212.4)",
      "oklch(86.5% 0.0617 213.0)",
      "oklch(75.2% 0.1019 215.1)",
      "oklch(70.0% 0.1129 217.2)",
      "oklch(66.5% 0.1163 219.0)",
      "oklch(63.3% 0.1166 221.7)",
      "oklch(58.7% 0.1076 221.1)",
      "oklch(51.8% 0.0953 221.5)",
      "oklch(41.9% 0.0760 219.5)",
      "oklch(27.8% 0.0495 216.8)",
      "oklch(19.3% 0.0341 215.7)",
    ],
  ),
  gray: grayRamp,
  green: ramp(
    [
      "tint60",
      "tint50",
      "tint40",
      "tint30",
      "tint20",
      "tint10",
      "primary",
      "shade10",
      "shade20",
      "shade30",
      "shade40",
      "shade50",
    ],
    [
      "oklch(97.6% 0.0152 145.5)",
      "oklch(90.4% 0.0564 145.1)",
      "oklch(82.8% 0.0981 144.6)",
      "oklch(67.9% 0.1564 143.6)",
      "oklch(60.9% 0.1686 143.2)",
      "oklch(56.0% 0.1708 142.9)",
      "oklch(51.0% 0.1654 142.7)",
      "oklch(47.5% 0.1534 142.7)",
      "oklch(42.0% 0.1343 142.7)",
      "oklch(34.1% 0.1064 142.8)",
      "oklch(23.2% 0.0677 143.0)",
      "oklch(17.0% 0.0450 143.3)",
    ],
  ),
  orange: ramp(
    [
      "tint60",
      "tint50",
      "tint40",
      "tint30",
      "tint20",
      "tint10",
      "primary",
      "shade10",
      "shade20",
      "shade30",
      "shade40",
      "shade50",
    ],
    [
      "oklch(98.6% 0.0084 56.3)",
      "oklch(93.8% 0.0333 51.2)",
      "oklch(88.8% 0.0635 52.0)",
      "oklch(78.5% 0.1275 50.5)",
      "oklch(74.0% 0.1592 48.9)",
      "oklch(70.7% 0.1808 46.3)",
      "oklch(68.0% 0.1981 43.0)",
      "oklch(62.9% 0.1820 43.2)",
      "oklch(55.6% 0.1598 43.4)",
      "oklch(44.6% 0.1251 44.1)",
      "oklch(29.5% 0.0760 47.1)",
      "oklch(20.4% 0.0466 53.1)",
    ],
  ),
  pink: ramp(
    [
      "tint60",
      "tint50",
      "tint40",
      "tint30",
      "tint20",
      "tint10",
      "primary",
      "shade10",
      "shade20",
      "shade30",
      "shade40",
      "shade50",
    ],
    [
      "oklch(98.1% 0.0107 339.3)",
      "oklch(92.8% 0.0412 339.6)",
      "oklch(86.7% 0.0771 340.4)",
      "oklch(75.2% 0.1514 342.8)",
      "oklch(69.8% 0.1872 344.0)",
      "oklch(66.5% 0.2097 345.2)",
      "oklch(63.7% 0.2265 346.7)",
      "oklch(58.9% 0.2082 346.7)",
      "oklch(52.1% 0.1819 346.5)",
      "oklch(42.0% 0.1437 346.3)",
      "oklch(27.8% 0.0868 344.9)",
      "oklch(19.4% 0.0534 342.5)",
    ],
  ),
  purple: ramp(
    [
      "tint60",
      "tint50",
      "tint40",
      "tint30",
      "tint20",
      "tint10",
      "primary",
      "shade10",
      "shade20",
      "shade30",
      "shade40",
      "shade50",
    ],
    [
      "oklch(97.1% 0.0098 305.4)",
      "oklch(88.5% 0.0378 308.0)",
      "oklch(79.3% 0.0666 306.1)",
      "oklch(61.2% 0.1192 304.7)",
      "oklch(52.5% 0.1399 303.8)",
      "oklch(46.7% 0.1498 302.3)",
      "oklch(41.5% 0.1558 301.2)",
      "oklch(38.6% 0.1432 301.7)",
      "oklch(34.5% 0.1247 301.6)",
      "oklch(28.5% 0.0972 302.4)",
      "oklch(20.1% 0.0576 304.0)",
      "oklch(15.0% 0.0357 306.1)",
    ],
  ),
  red: ramp(
    [
      "tint60",
      "tint50",
      "tint40",
      "tint30",
      "tint20",
      "tint10",
      "primary",
      "shade10",
      "shade20",
      "shade30",
      "shade40",
      "shade50",
    ],
    [
      "oklch(97.2% 0.0108 10.3)",
      "oklch(89.3% 0.0418 10.6)",
      "oklch(80.8% 0.0779 12.9)",
      "oklch(64.9% 0.1530 16.9)",
      "oklch(58.7% 0.1839 20.2)",
      "oklch(55.0% 0.1993 22.9)",
      "oklch(52.3% 0.2063 25.8)",
      "oklch(48.3% 0.1898 25.7)",
      "oklch(42.8% 0.1675 25.2)",
      "oklch(34.4% 0.1324 24.7)",
      "oklch(23.0% 0.0826 22.7)",
      "oklch(16.0% 0.0559 17.6)",
    ],
  ),
  teal: ramp(
    [
      "tint60",
      "tint50",
      "tint40",
      "tint30",
      "tint20",
      "tint10",
      "primary",
      "shade10",
      "shade20",
      "shade30",
      "shade40",
      "shade50",
    ],
    [
      "oklch(97.8% 0.0106 197.0)",
      "oklch(91.5% 0.0375 198.6)",
      "oklch(84.4% 0.0629 198.6)",
      "oklch(71.1% 0.0952 197.9)",
      "oklch(64.5% 0.0997 198.4)",
      "oklch(59.8% 0.0979 198.4)",
      "oklch(55.4% 0.0937 198.6)",
      "oklch(51.4% 0.0868 197.9)",
      "oklch(45.7% 0.0772 198.4)",
      "oklch(36.9% 0.0619 199.6)",
      "oklch(24.8% 0.0413 197.5)",
      "oklch(17.8% 0.0302 198.7)",
    ],
  ),
  yellow: ramp(
    [
      "tint60",
      "tint50",
      "tint40",
      "tint30",
      "tint20",
      "tint10",
      "primary",
      "shade10",
      "shade20",
      "shade30",
      "shade40",
      "shade50",
    ],
    [
      "oklch(99.5% 0.0119 101.5)",
      "oklch(98.0% 0.0470 100.7)",
      "oklch(96.6% 0.0875 103.0)",
      "oklch(93.7% 0.1553 102.6)",
      "oklch(92.5% 0.1786 102.8)",
      "oklch(91.5% 0.1871 101.8)",
      "oklch(90.9% 0.1896 101.0)",
      "oklch(83.9% 0.1749 100.8)",
      "oklch(74.1% 0.1548 101.5)",
      "oklch(55.4% 0.1158 101.6)",
      "oklch(38.3% 0.0801 101.8)",
      "oklch(25.7% 0.0540 103.3)",
    ],
  ),
};
