# @stealthscale/provider-i18n

`@stealthscale/provider-i18n` puts the words an application is read in into scope, in the locale it
is given. A package keeps its words under `locales/<language>/<namespace>.json` beside its code and
reads them with `useTranslation("<namespace>")`, its keys typed from its own fallback file.

i18next underneath, under this design system's own names, so a component imports it nowhere.

## Install

```bash
pnpm add @stealthscale/provider-i18n
```

The package peers on `i18next`, `react-i18next` and `react`. Install all three.

## Putting the words in scope

`@stealthscale/vite-plugin-i18n` finds every catalogue the application can reach and answers
`virtual:i18n`. Hand what it found to the provider.

```tsx
import { I18nProvider } from "@stealthscale/provider-i18n";
import { catalogues } from "virtual:i18n";

<I18nProvider catalogues={catalogues} locale={locale}>
  <App />
</I18nProvider>;
```

`locale` is a BCP 47 tag. Changing it re-renders every component below with the new strings, and
fetches the language when it is not yet loaded. The instance itself is built once and kept for the
life of the tree.

An application without the plugin passes `NONE` instead, which declares no language and no
namespace. Every key then resolves to itself, so a component renders `overlays.close` rather than an
empty string, and a missing catalogue is visible on the page.

## Reading a word

```tsx
import { useTranslation } from "@stealthscale/provider-i18n";

const { t } = useTranslation("overlays");

t("nested.close", { what: "the menu" });
t("pages", { count: 4 });
```

Every call names its namespace, which is what keeps a package's words its own. A key nothing defines
reads as the key rather than as nothing, so a component renders a string either way.

## The first paint

The fallback language's words are bundled, so `t` answers as soon as the provider is made and
nothing is fetched before the first paint. Every other language's namespace is fetched the first
time a component reads it, and that component suspends until it arrives. A locale such as `en-US`
over catalogues in `en` is bundled empty, so it paints from the fallback rather than suspending on a
fetch that would answer nothing.

A key missing in one language falls back down the tag, `nl-BE` to `nl` to the fallback, key by key,
so a half-translated package shows what it has.

## i18next options

Every option i18next states is still the application's. `options` is laid over the house's one level
deep, `plugins` are used in order before the catalogues' own backend, and `configure` runs on the
initialised instance.

```tsx
<I18nProvider
  catalogues={catalogues}
  configure={(instance) => instance.services.formatter?.add("shout", shout)}
  locale={locale}
  options={{ returnEmptyString: false }}
  plugins={[ICU]}
/>
```

The resources, the namespaces and the language come from the catalogues whatever the options say.

## In a specification

`@stealthscale/provider-i18n/testing` is a setup file that puts the fallback language in scope for
every specification, so a component rendered without a provider still says what it says.
`@stealthscale/vite-config-i18n` adds it.

## A changed word does not reload the page

On a dev server the catalogue plugin sends a changed catalogue as an `i18n:catalogue` event carrying
the pair merged afresh. The provider hears it and swaps the words in place, so the page keeps its
state. The two spell the event name the same by contract, because neither imports the other.
