# @stealthscale/hooks

`@stealthscale/hooks` answers a question about the page a component draws into. Some of the hooks
measure the document, some hold a value across renders without making the component render again,
and one speaks to a screen reader. Each of them reads React and the document and names nothing else,
so a package that draws no component installs React alone to use them.

## Install

```bash
pnpm add @stealthscale/hooks
```

The package peers on `react` and nothing else.

## useConst

Builds a value on the first render and returns that same value on every render after it.

Use it when the identity of a value matters and building it costs something: a collator, an
observer, an object used as a map key. `useMemo` is a cache the runtime may drop and rebuild, so a
caller that compares by identity cannot use it. A function passed here is called once, so wrap a
value that is itself a function in one that returns it.

```tsx
const collator = useConst(() => new Intl.Collator(locale, { sensitivity: "base" }));

const sorted = useMemo(() => [...names].sort(collator.compare), [collator, names]);
```

## useLiveRef

Points a ref at the value this render was given, and returns the ref.

Use it when a callback or an effect has to read the current value without naming it as a dependency.
A resize handler that named the width it compares against would detach and reattach its observer on
every render. The write happens during the render rather than in an effect, so a reader that runs
before the effects do still sees this render's value.

```tsx
const latest = useLiveRef(onResize);

useEffect(() => {
  const observer = new ResizeObserver(() => latest.current(element));

  observer.observe(element);

  return () => observer.disconnect();
}, [element, latest]);
```

## useCallbackRef

Returns a stable function that calls whichever callback the latest render passed.

Use it when you are about to put a handler in a dependency array. Anything written inline is a new
closure every render, so the effect would re-run every render. Name this instead and the effect
re-runs when its own dependencies say to. Where you want the returned function to change identity,
state the dependencies yourself in the second argument.

```tsx
export function useDismiss(onDismiss?: () => void) {
  const dismiss = useCallbackRef(onDismiss);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };

    document.addEventListener("keydown", escape);

    return () => document.removeEventListener("keydown", escape);
  }, [dismiss]);
}
```

## useSafeLayoutEffect

Measures and writes before the browser paints, and does nothing on a server.

Use it instead of `useLayoutEffect` in any component that renders on a server. A layout effect is
what stops a component that positions itself from being seen in the wrong place first. On a server
there is nothing to measure, and React warns about the call rather than skipping it, so what is
named there is the effect that never runs.

```tsx
useSafeLayoutEffect(() => {
  const { height } = content.current.getBoundingClientRect();

  panel.current.style.setProperty("--panel-height", `${String(height)}px`);
}, []);
```

## useControllableState

Returns the value and a setter, taking the value from the caller where the caller states one.

Use it for any piece of state a caller might want to own: an open flag, a selected value, a search
term. One component then serves a caller that drives it and a caller that wants it to look after
itself. Stating `value` at all is what makes the state controlled, so a caller that passes
`undefined` does not own it. Which of the two is in force is decided on every render, so a caller
that starts driving partway through is followed.

```tsx
export function Disclosure(props: DisclosureProps) {
  const [open, setOpen] = useControllableState({
    defaultValue: props.defaultOpen ?? false,
    onChange: props.onOpenChange,
    value: props.open,
  });

  return <button onClick={() => setOpen((was) => !was)}>{open ? "Hide" : "Show"}</button>;
}
```

`onChange` is told whenever the value changes, controlled or not. Setting the value it already holds
is passed over, so a caller listening for changes hears about changes.

## useMediaQuery

Reads whether each query matches, and re-reads them whenever any of them changes.

Use it when a decision depends on the page rather than on a prop. CSS cannot express one whose
answer changes what is rendered rather than how it looks. The queries are asked of one window and
answered in the order given, so a ladder of `min-width` queries reads as a ladder. A change re-reads
all of them, because one list changing can change what another answers.

```tsx
const [wide, dark] = useMediaQuery(["(min-width: 60rem)", "(prefers-color-scheme: dark)"]);

return wide ? <Sidebar /> : <Drawer />;
```

The first render reports the fallback rather than asking the window, so a server's markup and the
client's first paint agree. Pass `ssr: false` to ask the window on that first render. Pass
`fallback` to say what each query answers until the window has been asked.

## useCoarsePointer

Reads whether the reader's main pointer is a finger rather than a mouse or a pen.

Use it where a fine pointer is what an interaction assumes. A finger cannot rest on an element, so
anything that appears on hover alone never appears, and it cannot aim at a hairline, so a small
target needs to grow.

```tsx
const touch = useCoarsePointer();

return (
  <Row data-density={touch ? "comfortable" : "compact"}>
    {touch ? <MoreButton /> : <HoverActions />}
  </Row>
);
```

## useIsOverflowing

Watches an element and returns whether what is inside it is cut off.

Use it when the text not fitting is what decides whether to draw something else. A tooltip with the
full label, a read-more control and a fade at the edge all need that answer. CSS can truncate the
text without telling you that it did.

The element is measured again on four occasions:

- It changes size.
- Its content changes.
- Its parent changes size.
- The fonts finish loading.

```tsx
const ref = useRef<HTMLSpanElement>(null);
const { overflows } = useIsOverflowing(ref);

return (
  <Tooltip content={overflows ? children : undefined}>
    <span ref={ref}>{children}</span>
  </Tooltip>
);
```

The answer keeps one identity while it stands, so the component renders again only when the element
crosses between fitting and not.

## useStickyOffsets

Sets a custom property on each sticky band holding the height of the bands before it, and one on the
column holding the height of all of them.

Use it when more than one band sticks in the same scroll container. A page header above a toolbar
above a table head is three of them. The second band has to sit below the first, and
`position: sticky` gives it no way to learn how tall the first is.

```tsx
useStickyOffsets(column, stuck, {
  bands: "[data-band]",
  offset: "--band-offset",
  total: "--stuck-height",
});
```

```css
[data-band] {
  position: sticky;
  top: var(--band-offset, 0);
}
```

A band rendered later is measured when the column next changes size rather than on a size change of
its own.

## useMatrixCrosshair

Returns the ref to hang on a grid and the two handlers that light a row and a column as the pointer
crosses them.

Use it in a grid wide enough that "row 14, column 9" is a counting exercise. Column headers in such
a grid carry short names, because rotated text is unreadable and most magnifiers cannot show it, and
this turns a short name back into a row somebody can read. The lights are written through the DOM
rather than through state, because a matrix of a few hundred items either way is tens of thousands
of cells.

```tsx
const { clear, ref, track } = useMatrixCrosshair<HTMLTableElement>();

return (
  <table ref={ref} onPointerMove={track} onPointerLeave={clear}>
    <td data-row={rowId} data-column={columnId} />
  </table>
);
```

```css
td[data-lit] {
  background: var(--colors-bg-muted);
}
```

An element may carry both markings, which is what lets a matrix of one set against itself light the
row a hovered column stands for.

## useAnnounce

Returns a function that says a message to a screen reader.

Use it when something changes that the page shows without words: "5 results", "copied", "row
removed". What happened is plain on screen and silent to anything reading it aloud. `polite` waits
for a gap and suits nearly everything. `assertive` interrupts whatever is being read mid-word, which
suits an error that invalidates what somebody is doing and nothing else.

```tsx
const announce = useAnnounce();

const copy = async () => {
  await navigator.clipboard.writeText(value);
  announce("Copied");
};

const onFail = (error: Error) => {
  announce(`Could not save. ${error.message}`, "assertive");
};
```

Messages queued in one frame are joined into a single utterance, because a live region says one
thing per change. One component announcing twice is correcting itself, so its later message replaces
its earlier one. Where two components announce, both facts are read. The same message twice is said
twice, since "copied" pressed twice is two events somebody wants confirmed.

## speakable

Joins a frame's messages into the one thing the region says.

`useAnnounce` calls this itself. Use it directly only when you write into a live region of your own
and want the same joining rule. A full stop is added only where the message before it ends in none,
and anything said twice is said once.

```ts
speakable(["Saved", "3 rows selected", "Saved"]);
```

That returns `Saved. 3 rows selected`.

## createRequiredContext

Makes a context a reader has to be inside, and the hook that reads it.

Use it for a component drawn in parts, where every part needs something the root holds. React
answers a missing provider with the default value, so a part drawn outside its root draws wrongly
and says nothing, and the fault surfaces somewhere else entirely. This throws where the part was
written instead, and names the component so the message says which root is missing.

```tsx
const [ApiProvider, useCollapsible] = createRequiredContext<CollapsibleApi>("Collapsible");

function Root({ children }: RootProps): ReactElement {
  const api = collapsible.connect(useMachine(collapsible.machine, { id: useId() }), normalizeProps);

  return <ApiProvider value={api}>{children}</ApiProvider>;
}

function Trigger(props: TriggerProps): ReactElement {
  const api = useCollapsible();

  return <Styled {...mergeProps(api.getTriggerProps(), props)} />;
}
```

A trigger drawn with no root above it throws
`A part of Collapsible was drawn outside the root that holds it together.` A reader under two
providers gets the value of the nearer one, and each call makes a context of its own, so two
components never read each other's.

## Types

| Type                        | Declaration               | What it describes                                                  |
| --------------------------- | ------------------------- | ------------------------------------------------------------------ |
| `Overflow`                  | `interface`               | Whether content is cut off across, down, or on either axis         |
| `MatrixCrosshair`           | `interface`               | The ref and the two handlers a grid hangs on itself                |
| `UseControllableStateProps` | `interface`               | The value, the default and what to tell when either changes        |
| `UseMediaQueryOptions`      | `interface`               | The fallback before the window is asked, and which window to ask   |
| `UseStickyOffsetsOptions`   | `interface`               | Which bands stick, and which custom properties carry their offsets |
| `AnnouncePoliteness`        | `"assertive" \| "polite"` | How much a message is allowed to interrupt                         |
| `ProvidedProps`             | `interface`               | The value a provider carries and the tree that reads it            |

## Licence

MIT. See [LICENSE](LICENSE).
