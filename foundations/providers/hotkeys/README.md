# @stealthscale/provider-hotkeys

`@stealthscale/provider-hotkeys` publishes the keyboard shortcuts a page answers to. It is
TanStack's hotkeys under this design system's own name, and it adds nothing to them: a shortcut
behaves the way that library documents it.

An application and every component import shortcuts from one place, which is the whole point of the
rename. The day this design system moves to another library or grows a default of its own, the
change happens here rather than at every call site.

## Install

```bash
pnpm add @stealthscale/provider-hotkeys @tanstack/react-hotkeys
```

The package peers on `@tanstack/react-hotkeys` and `react`. Install both.

## Usage

Render the provider innermost, under everything else, because a shortcut is answered by whatever is
on screen.

```tsx
import { HotkeysProvider } from "@stealthscale/provider-hotkeys";

<HotkeysProvider>
  <Page />
</HotkeysProvider>;
```

Register a shortcut where it is answered.

```tsx
import { useHotkey } from "@stealthscale/provider-hotkeys";

export function SearchField() {
  const ref = useRef<HTMLInputElement>(null);

  useHotkey("Mod+K", () => ref.current?.focus());

  return <input ref={ref} type="search" />;
}
```

`Mod` is the platform's own command key: `Ctrl` on Windows and Linux, `⌘` on a Mac. Write a binding
beside what it does with `formatForDisplay`, which answers `Ctrl+K` on Windows and `⌘ K` on a Mac.

```tsx
<kbd>{formatForDisplay("Mod+K")}</kbd>
```

## The defaults

Every default is the library's own. A shortcut stops the browser's action, stops the event
propagating, and is ignored while an input has focus, so typing `k` in a search field does not fire
a shortcut bound to `k`. `useDefaultHotkeysOptions` reads what the provider settled on.

## Reference

The package re-exports every name `@tanstack/react-hotkeys` states, more than sixty of them, through
a wildcard rather than a written list. The library is still below its first major, and a written
list would drift on the release that adds a name. Read that library's own documentation for what
each one does.

Note: the wildcard means this package's API is the library's API. A name the library adds appears
here without a release of this package, and a name it removes disappears the same way. That is the
intent for a package whose whole content is the rename.

## Licence

MIT. See [LICENSE](LICENSE).
