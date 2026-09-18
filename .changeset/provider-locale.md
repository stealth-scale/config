---
"@stealthscale/provider-locale": minor
---

provider-locale: decide which locale a page is read in

- `LocaleProvider` reads in what a person chose, else the best of the offers for what their browser
  asks for, else the first. The choice is remembered under the application's name through
  `@stealthscale/settings`.
- `lang` and `dir` go onto the document root, where the stylesheet's logical properties, a screen
  reader's voice and the browser's own controls read them. Inside an iframe or a shadow root they go
  onto whichever document `@stealthscale/provider-environment` names.
- Given `locale` and `onLocaleChange` the provider reads in what it is told and remembers nothing,
  so a router that carries the locale in the URL drives it.
- `Translated` mounts the i18n provider in the locale in force, so a change of locale changes every
  string below.
- `negotiate` runs ECMA-402's lookup: each requested tag is truncated in turn, so `nl-BE` reaches
  `nl`. Where truncation finds nothing, both sides widen to their likely script and region, so
  `zh-HK` reaches `zh-Hant` and `en-GB` reaches `en-US`.
- `preferences` reads an `Accept-Language` header, dropping the wildcard and anything at `q=0`,
  which RFC 9110 gives the meaning "not acceptable".
- `directionOf` decides direction from the script rather than from `getTextInfo`, because the
  engines disagree on it. Bun's ICU calls Thaana and Hanifi Rohingya left to right while every
  engine agrees on the likely script.
- A component that positions itself by direction reads `useLocale().direction` and hands `dir` to
  its machine. The platform's version wrapped Ark UI's direction provider, which this repository
  does not install.
