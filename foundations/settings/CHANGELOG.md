# @stealthscale/settings

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`044f611`](https://github.com/stealth-scale/config/commit/044f6110d6f70ace50ab25e7d545c3399d0ea72b) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - settings: add the setting a person chose, kept where the reader chooses
  
  - `defineSetting` declares one setting: its name, the values it may take, the value it falls back
    to, and the store that keeps it. The fallback is stated apart from the values, so a colour mode
    that follows the machine until somebody overrides it states both without repeating either.
  - `useSetting(app, setting)` returns the value and its setter. The value is read from the store on
    every render rather than copied into state, so two components reading one setting agree, a setting
    changed in another tab reaches this one, and a write the store refuses leaves the value as it was.
  - `readSetting`, `writeSetting` and `clearSetting` do the same without React, for a server and for
    the script an application inlines to settle its first paint.
  - `SettingStore` asks for `subscribe` beside read and write. The browser's own `Storage` interface
    reports nothing, which is why a setting built on it alone cannot report one tab's choice to
    another.
  - `localStore()` keeps settings in the page's storage and follows the `storage` event. It is one
    store however many times it is called, so two settings share the readers watching a key.
  - `cookieStore()` keeps settings in a cookie, which a server reads from the request header before it
    renders. A setting that decides the first paint belongs here, because the first response then
    carries the remembered value and no script corrects the page after it paints. Reading goes through
    `document.cookie`, which returns at once, and the Cookie Store API reports a change where the
    browser ships it.
  - `memoryStore()` keeps settings for as long as the process runs, and builds a store per call so one
    specification never reads what another wrote.
  - `settingKey(app, name)` writes the key, which is what an inline script reads.
  - Each store remembers what it last read and forgets a key when it changes. A snapshot is read on
    every render of every reader, and parsing a twelve-cookie header measured 458 nanoseconds against
    6 for a cached value.
  - The three functions a reader needs are built once per setting and application, outside React, so
    two components reading one setting share one subscription rather than one each.
