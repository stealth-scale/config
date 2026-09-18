# @stealthscale/provider-locale

`@stealthscale/provider-locale` decides which locale a page is read in, remembers the choice, and
writes the direction that follows onto the document.

## Install

```bash
pnpm add @stealthscale/provider-locale
```

The package peers on `@stealthscale/provider-environment`, `@stealthscale/provider-i18n`,
`@stealthscale/settings` and `react`.

## Usage

```tsx
import { LocaleProvider, Translated } from "@stealthscale/provider-locale";
import { catalogues } from "virtual:i18n";

<LocaleProvider app="orders" locales={["en-US", "nl", "ar-EG"]}>
  <Translated catalogues={catalogues}>
    <App />
  </Translated>
</LocaleProvider>;
```

`locales` lists what the application offers, the first being its fallback. The locale in force is
what a person chose, else the best of those offers for what their browser asks for, else the first.
The choice is remembered under `app`, so two applications on one origin keep their own.

`Translated` mounts the i18n provider in whichever locale is in force, so changing the locale
changes every string below. Leave `catalogues` out and it renders its children untouched.

## Reading it

```tsx
const { direction, locale, locales, setLocale } = useLocale();
```

`setLocale` ignores a tag the application does not offer. `direction` follows from the locale's
script: `rtl` for Arabic, Hebrew, Persian, Urdu and Divehi, `ltr` for everything else, including
`ar-Latn`.

`lang` and `dir` go onto the document root, because the stylesheet's logical properties, a screen
reader's voice and the browser's own controls all read them there. Inside an iframe or a shadow root
they go onto whichever document `@stealthscale/provider-environment` names.

A component that positions itself by direction reads `useLocale().direction` and hands `dir` to its
machine.

## Letting something else drive

Pass `locale` and `onLocaleChange` and the provider reads in what it is told, remembering nothing
itself. A router that carries the locale in the URL drives it this way, and `isPending` shows a
switcher that a transition is under way.

```tsx
<LocaleProvider
  app="orders"
  isPending={isPending}
  locale={params.locale}
  locales={LOCALES}
  onLocaleChange={(next) => startTransition(() => navigate(next))}
/>
```

## Matching on the server

`preferences` reads an `Accept-Language` header into the tags a client will accept, dropping the
wildcard and anything at `q=0`. `negotiate` matches those against what an application offers.

```ts
const locale = negotiate(
  preferences(request.headers.get("accept-language")).map((one) => one.tag),
  LOCALES,
  LOCALES[0],
);
```

Matching is ECMA-402's lookup: each requested tag is truncated in turn, so `nl-BE` reaches `nl`.
Where truncation finds nothing, both sides widen to their likely script and region, so `zh-HK`
reaches `zh-Hant` and `en-GB` reaches `en-US`.

## Reading a tag

`canonical`, `parts`, `widened`, `chain`, `widenedChain` and `directionOf` read a BCP 47 tag through
the engine's own `Intl`. Each returns undefined, or an empty array, for a string that is not a tag.
