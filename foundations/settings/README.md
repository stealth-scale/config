# @stealthscale/settings

`@stealthscale/settings` remembers one named value a person chose. A setting is kept per
application, so two applications on one origin keep their own. Where it is kept is part of its
definition rather than of a call, so one setting reads the same on a server and in a browser.

The value is read from the store on each render rather than copied into state. Every reader of one
setting therefore reads one value, in this tab and in every other. A tab somebody left open cannot
overwrite a choice they made somewhere else, because it holds no stale copy to write back.

## Install

```bash
pnpm add @stealthscale/settings
```

The package peers on `react` and nothing else.

## Defining a setting

A setting states its name, the values it may take, and what it answers until a person chooses. The
fallback is stated apart from the values, so a colour mode that follows the machine until somebody
overrides it says both without repeating either.

```ts
import { defineSetting } from "@stealthscale/settings";

export const colorMode = defineSetting({
  fallback: "system",
  name: "color-mode",
  values: ["light", "dark"],
});
```

## Reading it in a component

```tsx
import { useSetting } from "@stealthscale/settings";

export function ColorModeToggle({ app }: { app: string }) {
  const [mode, setMode] = useSetting(app, colorMode);

  return <button onClick={() => setMode(mode === "dark" ? "light" : "dark")}>{mode}</button>;
}
```

The application's name is passed in rather than read from a context, because the server and any
inline script have to name the same application and neither of those has React around it.

## Reading it without React

`readSetting`, `writeSetting` and `clearSetting` take the same definition and no hook. A server
answering a request uses them, and so does the script an application inlines to settle its first
paint.

```ts
import { cookieStore, defineSetting, readSetting } from "@stealthscale/settings";

const mode = readSetting("docs", colorMode);
```

## The three stores

| Store           | Kept in            | Seen by the server | Reaches another tab                                   |
| --------------- | ------------------ | ------------------ | ----------------------------------------------------- |
| `localStore()`  | The page's storage | No                 | At once, through `storage`                            |
| `cookieStore()` | A cookie           | Yes                | At once, where the browser ships the Cookie Store API |
| `memoryStore()` | The process        | Not applicable     | Not applicable                                        |

`localStore()` is what a setting uses where it names no store, and it is right for anything the page
decides after it has drawn.

`cookieStore()` is for a setting that decides the first paint. A cookie is the one place a setting
is visible to the server, so the first response already carries the remembered value and no script
has to correct the page after it paints. On a server, build the store from the request:

```ts
const store = cookieStore({ header: request.headers.get("cookie") ?? "" });

export const theme = defineSetting({ fallback: "fathom", name: "theme", store, values: THEMES });
```

The cost is that a cookie rides on every request and shares a four-kilobyte budget per origin.
Reading is synchronous, through `document.cookie`, because a snapshot is read during a render. The
Cookie Store API reports a change, so another tab reaches this one where the browser has shipped
that interface. It reached Baseline in June 2025 and needs a secure context. Where it is absent, a
cookie changed elsewhere arrives on the next load.

`memoryStore()` holds settings for as long as the process runs. Each call builds a store of its own,
which is what makes it right for a specification: one case never reads what another wrote.

## The inline script

A person who has never chosen gets the right first paint from CSS alone, because the theme
foundation's conditions follow the operating system where the page writes no attribute. The flash
only happens when a stored choice disagrees with the machine.

A server-rendered application solves that with a cookie and renders the attribute itself. A static
single-page application has no server to personalise the document, so it still needs a blocking
script in the head. That script reads the key `settingKey` writes and nothing else from this
package.

## Reference

| Export          | Signature                                                                       |
| --------------- | ------------------------------------------------------------------------------- |
| `defineSetting` | `<Value>(options: SettingOptions<Value>) => SettingDefinition<Value>`           |
| `settingKey`    | `(app: string, name: string) => string`                                         |
| `readSetting`   | `<Value>(app: string, setting: SettingDefinition<Value>) => Value`              |
| `writeSetting`  | `<Value>(app: string, setting: SettingDefinition<Value>, value: Value) => void` |
| `clearSetting`  | `<Value>(app: string, setting: SettingDefinition<Value>) => void`               |
| `useSetting`    | `<Value>(app, setting) => readonly [Value, (value: Value) => void]`             |
| `localStore`    | `() => SettingStore`                                                            |
| `cookieStore`   | `(options?: CookieStoreOptions) => SettingStore`                                |
| `memoryStore`   | `(initial?: Readonly<Record<string, string>>) => SettingStore`                  |
| `watchers`      | `() => Watchers`                                                                |

## Writing a store

A store is read, written, cleared and subscribed to. The browser's own `Storage` interface has no
notification, which is why a setting built on it alone cannot tell one tab what another chose.
Asking every store for `subscribe` makes that part of the contract.

```ts
export interface SettingStore {
  clear: (key: string) => void;
  read: (key: string) => null | string;
  subscribe: (key: string, onChange: () => void) => () => void;
  write: (key: string, value: string) => void;
}
```

`watchers()` builds the set of callbacks a store tells when one of its keys changes. A store needs
one because no browser event fires in the document that made the change, so a write would otherwise
reach every other tab and not the one the person is looking at.

## Licence

MIT. See [LICENSE](LICENSE).
