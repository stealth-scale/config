/**
 * Publishes the patterns a recipe reads as its base: one typed function per pattern, and nothing
 * generated from any of them.
 *
 * @remarks
 *   A recipe file is imported by its component, and everything the file imports reaches the
 *   browser bundle. Each pattern here is a function of a few lines, so a recipe reading one adds
 *   nothing to the bundle beyond the styles it returns.
 */

export { absoluteCenter, type AbsoluteCenterProps } from "#patterns/absolute-center.ts";
export { cluster, type ClusterProps } from "#patterns/cluster.ts";
export { cover, type CoverProps } from "#patterns/cover.ts";
export { center, type CenterProps, flex, type FlexProps } from "#patterns/flex.ts";
export { frame, type FrameProps } from "#patterns/frame.ts";
export { grid, type GridProps, simpleGrid, type SimpleGridProps } from "#patterns/grid.ts";
export { reel, type ReelProps } from "#patterns/reel.ts";
export { responsive } from "#patterns/responsive.ts";
export { scrollable, type ScrollableProps } from "#patterns/scrollable.ts";
export { sidebar, type SidebarProps } from "#patterns/sidebar.ts";
export { type FixedStackProps, hstack, stack, type StackProps, vstack } from "#patterns/stack.ts";
export { switcher, type SwitcherProps } from "#patterns/switcher.ts";
export { visuallyHidden } from "#patterns/visually-hidden.ts";
