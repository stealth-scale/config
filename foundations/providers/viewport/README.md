# @stealthscale/provider-viewport

`@stealthscale/provider-viewport` lays a subtree out for a width you state rather than the window's.
A catalogue states one to show a page as a phone sees it. A specification states one to render a
component at a size without stubbing `matchMedia`.

The breakpoint hooks read the stated width before they read the window, so a catalogue drawing a
phone beside a desktop lays each preview out at its own width. Outside a provider they read the
window, which is what an ordinary application wants and why none of them insists on one above.

## Install

```bash
pnpm add @stealthscale/provider-viewport
```

The package peers on `@stealthscale/hooks`, `@stealthscale/theme` and `react`.

## Usage

Wrap the subtree and state the width in pixels.

```tsx
import { ViewportProvider } from "@stealthscale/provider-viewport";

<ViewportProvider width={390}>
  <Page />
</ViewportProvider>;
```

Omit `width` to leave the window in charge until something states one. `useViewport` reads the
width, the widths on offer, and the setter a toolbar drives.

```tsx
import { useViewport } from "@stealthscale/provider-viewport";

export function SizeToolbar() {
  const { setWidth, sizes, width } = useViewport();

  return sizes.map(({ min, name }) => (
    <button key={name} aria-pressed={width === min} onClick={() => setWidth(min)}>
      {name}
    </button>
  ));
}
```

## Reading the breakpoint

`useBreakpoint` answers the widest breakpoint that starts at or under the width. Name the ones that
count, because only those are matched.

```ts
const at = useBreakpoint({ breakpoints: ["base", "md", "lg"] });
```

State a value per breakpoint and `useBreakpointValue` picks the one in force. Key it by name or list
it in the theme's order, with `null` for a gap. A breakpoint that states nothing takes the nearest
narrower one's value, which is how a value stated for `base` and `md` alone holds at `lg`.

```ts
const columns = useBreakpointValue({ base: 1, md: 2, xl: 4 });
const gap = useBreakpointValue([2, null, 4]);
```

The window is asked the way the styling engine asks it, one `min-width` query per breakpoint, so a
component and its stylesheet switch at the same pixel. Both hooks answer the fallback on a server
and ask the window after the first render, which keeps a server's markup and the client's first
paint the same. Pass `ssr: false` to ask on the first render instead.

Warning: a style prop such as `{ base: 1, md: 2 }` compiles to a media query, and a browser matches
that query against the window. The stated width never reaches it. Switch a block that has to follow
the provider with `useBreakpointValue` rather than with a style prop.

## Measuring an element

`useNarrow` measures the element rather than the window, so a page beside an open sidebar answers
for its own width.

```tsx
const ref = useRef<HTMLElement>(null);
const narrow = useNarrow(ref, 600);
```

The element is measured once it is laid out and again whenever its size changes. Before it is
measured, and while the ref holds nothing, the answer comes from the viewport: narrow under `md`,
which is what a phone is, so a phone never lays out wide first. Pass a third argument to guess under
a different breakpoint.

## Reference

| Export               | Signature                                                           |
| -------------------- | ------------------------------------------------------------------- |
| `ViewportProvider`   | `(props: ViewportProviderProps) => ReactElement`                    |
| `useViewport`        | `() => ViewportContextValue`                                        |
| `useBreakpoint`      | `(options?: UseBreakpointOptions) => string`                        |
| `useBreakpointValue` | `<Value>(value: Responsive<Value>, options?) => undefined \| Value` |
| `useNarrow`          | `(ref, width: number, below?: string) => boolean`                   |
| `sizesOf`            | `() => Size[]`                                                      |
| `pixelsOf`           | `(length: null \| string \| undefined) => number`                   |
| `BASE_SIZE`          | `Size`                                                              |

`sizesOf` reads the widths the design system's breakpoints start at, narrowest first, and leaves
`base` out because it starts at nothing and has no token. A provider offers these unless it is given
its own `sizes`.

`pixelsOf` reads a length the way the styling engine writes one. The engine keeps its breakpoints in
rem and compiled its queries against a root font size of sixteen pixels, so that is the number used
here rather than the document's own.

Note: a breakpoint is read from the compiled vocabulary rather than from a theme. A theme that moved
one would move it for every component written against the foundation, so the compiler's preset
states them and a theme leaves them alone.

## Licence

MIT. See [LICENSE](LICENSE).
