---
"@stealthscale/provider-viewport": minor
---

provider-viewport: add the provider that lays a subtree out for a stated width

- `ViewportProvider` lays its subtree out for a width in pixels, or for the window until one is
  stated. A catalogue states one to show a page as a phone sees it, and a specification states one
  to render a component at a size without stubbing `matchMedia`.
- `useViewport` reads the width, the widths on offer and the setter a toolbar drives. Outside a
  provider the window decides and setting a width changes nothing, which is what lets every
  breakpoint hook ask without insisting on a provider above it.
- `useBreakpoint` returns the widest breakpoint that starts at or under the width, counting only the
  ones a caller names. The window is read the way the styling engine reads it, one `min-width` query
  per breakpoint, so a component and its stylesheet switch at the same pixel.
- `useBreakpointValue` returns the value stated for that breakpoint, keyed by name or listed in the
  theme's order. A breakpoint that states nothing takes the nearest narrower one's value.
- `useNarrow` measures an element rather than the window, so a page beside an open sidebar reports
  its own width. Until the element is measured the result comes from the viewport, so a phone never
  lays out wide first.
- `sizesOf` reads the widths the design system's breakpoints start at, from the compiled vocabulary
  rather than from a theme, and builds the list once. `pixelsOf` converts a length against the
  sixteen pixels the styling engine compiled its queries with.
- `ViewportProvider` takes `width` as the caller's, `defaultWidth` as its own, and `onWidthChange`
  to report to the caller what the setter was given, the way every controllable component here takes
  a value. A width the caller changes reaches the subtree on the next render.
- A breakpoint name is a `Breakpoint`, which is `base` or one the vocabulary states, in
  `useBreakpoint`, `useBreakpointValue`, `useNarrow` and `Responsive`. A misspelt name is refused
  where it is written.
- `useNarrow` measures an element that arrives after the first layout, and measures again against a
  width the caller changes.
- `useBreakpoint` reads no query from the window where a provider states the width.

The breakpoint hooks come from the hook package of the library we are porting from. They read the
viewport, so they belong beside it rather than in a package that peers on React alone.
