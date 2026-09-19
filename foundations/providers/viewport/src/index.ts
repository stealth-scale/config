/**
 * Publishes the width a page is read at, laid over the window's own. A breakpoint hook asks the
 * viewport before it asks the window, so a catalogue drawing a phone beside a desktop lays each
 * preview out at its own width rather than at the browser's.
 *
 * @packageDocumentation
 */

export {
  type Responsive,
  useBreakpoint,
  type UseBreakpointOptions,
  useBreakpointValue,
  type UseBreakpointValueOptions,
} from "#breakpoint.ts";
export { useViewport, type ViewportContextValue } from "#context.ts";
export { useNarrow } from "#narrow.ts";
export { ViewportProvider, type ViewportProviderProps } from "#provider.tsx";
export { BASE_SIZE, type Breakpoint, pixelsOf, type Size, sizesOf, widthOf } from "#size.ts";
