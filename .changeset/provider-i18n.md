---
"@stealthscale/provider-i18n": minor
---

provider-i18n: put the strings an application is read in into scope

- `I18nProvider` builds one i18next instance from the catalogues and the locale and keeps it for the
  life of the tree. Only `locale` is followed after that: changing it re-renders every component
  below and fetches the language when it is not yet loaded.
- The instance is not registered globally, so a tree without the provider reads nothing rather than
  whichever instance was built last.
- The fallback language is bundled, so `t` resolves as soon as the provider is built. Every other
  namespace is fetched on first read and suspends the component until it arrives.
- A locale such as `en-US` over catalogues in `en` is registered with an empty bundle. i18next reads
  that as already loaded, so the first paint falls straight through to the fallback instead of
  suspending on a fetch that resolves to nothing.
- A missing key falls back down the tag, `nl-BE` to `nl` to the fallback, key by key, so a
  half-translated package shows what it has.
- `Resources` is where the plugin's generated types land. `defaultNS` is false, so every call names
  its namespace and a package's strings stay its own. `returnNull` is false, so `t` always returns a
  string.
- `NONE` supplies empty catalogues for an application the plugin never ran in.
- `options`, `plugins` and `configure` leave every i18next option the application's. `resources`,
  `ns` and `lng` always come from the catalogues.
- `./testing` is a setup file that assigns the global instance in the fallback language, so a
  specification rendering a component outside a provider reads real strings rather than the key.
- i18next and react-i18next are re-exported under this package's name, so a component imports them
  nowhere.
