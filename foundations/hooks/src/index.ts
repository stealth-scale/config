/**
 * Publishes the hooks that answer a question about the page a component draws into: how it is
 * read, what it measures, and what it held a render ago. It publishes the plumbing a component
 * drawn in parts needs beside them. Each one reads React and the document and names nothing else,
 * so a package that draws no component still installs only React to use them.
 *
 * @packageDocumentation
 */

export { createRequiredContext, type ProvidedProps } from "#create-required-context.ts";
export { type AnnouncePoliteness, speakable, useAnnounce } from "#use-announce.ts";
export { useCallbackRef } from "#use-callback-ref.ts";
export { useCoarsePointer } from "#use-coarse-pointer.ts";
export { useConst } from "#use-const.ts";
export { useControllableState, type UseControllableStateProps } from "#use-controllable-state.ts";
export { type Overflow, useIsOverflowing } from "#use-is-overflowing.ts";
export { useLiveRef } from "#use-live-ref.ts";
export { type MatrixCrosshair, useMatrixCrosshair } from "#use-matrix-crosshair.ts";
export { useMediaQuery, type UseMediaQueryOptions } from "#use-media-query.ts";
export { useSafeLayoutEffect } from "#use-safe-layout-effect.ts";
export { useStickyOffsets, type UseStickyOffsetsOptions } from "#use-sticky-offsets.ts";
