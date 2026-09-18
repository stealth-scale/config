# @stealthscale/provider-locale

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`39c4394`](https://github.com/stealth-scale/config/commit/39c43948c7e2635746815ead362ac844173758f0) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - provider-locale: decide which locale a page is read in
  
  - `LocaleProvider` uses what a person chose. Where they chose nothing, it uses the best of the
    offers for what their browser asks for, and where nothing matches, the first. The choice is
    remembered under the application's name through `@stealthscale/settings`.
  - `lang` and `dir` go onto the document root, where the stylesheet's logical properties, a screen
    reader's voice and the browser's own controls read them. Inside an iframe or a shadow root they go
    onto whichever document `@stealthscale/provider-environment` names.
  - Given `locale` and `onLocaleChange` the provider uses the locale it is given and remembers
    nothing, so a router that carries the locale in the URL drives it.
  - This package's own `I18nProvider` mounts the one from `@stealthscale/provider-i18n` in the locale
    in force, so a change of locale changes every string below. An instance is mounted whether or not
    there are catalogues to mount, because rendering the page with none leaves every `useTranslation`
    below without one and logs `NO_I18NEXT_INSTANCE` for each.
  - `negotiate` runs ECMA-402's lookup: each requested tag is truncated in turn, so `nl-BE` matches
    `nl`. Where truncation finds nothing, both sides widen to their likely script and region, so
    `zh-HK` matches `zh-Hant` and `en-GB` matches `en-US`.
  - `preferences` reads an `Accept-Language` header, dropping the wildcard and anything at `q=0`,
    which RFC 9110 gives the meaning "not acceptable".
  - `directionOf` decides direction from the script rather than from `getTextInfo`, because the
    engines disagree on it. Bun's ICU calls Thaana and Hanifi Rohingya left to right while every
    engine agrees on the likely script.
  - A component that positions itself by direction reads `useLocale().direction` and passes `dir` to
    its machine. The platform's version wrapped Ark UI's direction provider, which this repository
    does not install.

### Patch Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`ec4b811`](https://github.com/stealth-scale/config/commit/ec4b81154daadbe496f8172ead2897ca68f0e63d) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - specifications: stop reading the page's real local storage
  
  The locale provider's pending case and the draft specification both read the page's real local
  storage. Node 26 defines `globalThis.localStorage` and returns `undefined` for it without
  `--localstorage-file`, so each run reported `ExperimentalWarning: localStorage is not available`.
  
  The pending case now takes a memory store like every case beside it. The draft specification stubs a
  working storage, which is what it takes to check that the draft is written and cleared. Reading a
  storage that returns nothing proved only that the hook does not throw.
- Updated dependencies [[`1c1e6c3`](https://github.com/stealth-scale/config/commit/1c1e6c381bcabc79cdb1e2019131b71d0e88e805), [`83f3481`](https://github.com/stealth-scale/config/commit/83f34814305877c1b60fa3a06ccfd1644c159615), [`044f611`](https://github.com/stealth-scale/config/commit/044f6110d6f70ace50ab25e7d545c3399d0ea72b)]:
  - @stealthscale/provider-environment@0.1.0
  - @stealthscale/provider-i18n@0.1.0
  - @stealthscale/settings@0.1.0
