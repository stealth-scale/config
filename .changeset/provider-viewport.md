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
- `useBreakpoint` answers the widest breakpoint that starts at or under the width, counting only the
  ones a caller names. The window is asked the way the styling engine asks it, one `min-width` query
  per breakpoint, so a component and its stylesheet switch at the same pixel.
- `useBreakpointValue` answers the value stated for that breakpoint, keyed by name or listed in the
  theme's order. A breakpoint that states nothing takes the nearest narrower one's value.
- `useNarrow` measures an element rather than the window, so a page beside an open sidebar answers
  for its own width. Until the element is measured the answer comes from the viewport, so a phone
  never lays out wide first.
- `sizesOf` reads the widths the design system's breakpoints start at, from the compiled vocabulary
  rather than from a theme. `pixelsOf` converts a length against the sixteen pixels the styling
  engine compiled its queries with.

The breakpoint hooks come from the platform's hook package. They read the viewport, so they belong
beside it rather than in a package that peers on React alone.
