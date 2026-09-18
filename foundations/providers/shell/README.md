# @stealthscale/provider-shell

`@stealthscale/provider-shell` composes every provider an application renders, in the order each
depends on the one before. Every other provider is its own package, so an application that wants one
takes one. This package exists so the order is written once rather than re-derived at every mount.

## Install

```bash
pnpm add @stealthscale/provider-shell
```

The package peers on the six providers it composes, on `@stealthscale/theme`,
`@stealthscale/settings` and on `react`.

## Usage

```tsx
import { Shell } from "@stealthscale/provider-shell";
import { catalogues } from "virtual:i18n";

<Shell app="orders" catalogues={catalogues} locales={["en-US", "nl"]} theme="forge">
  <RouterProvider router={router} />
</Shell>;
```

`app` is the only required prop. Every setting a person makes is remembered under it, so two
applications on one origin keep their own.

An application renders its router and its data clients as children, so one without either bundles
neither. Routes and data stay its own.

## The order

| Provider              | Why it sits where it does                                                             |
| --------------------- | ------------------------------------------------------------------------------------- |
| `EnvironmentProvider` | A portal attaches and a measurement is taken against the root node, so it comes first |
| `ColorModeProvider`   | Chooses and remembers the mode, and writes it on the document root                    |
| `ThemeProvider`       | Draws below in the theme and the chosen mode                                          |
| `LocaleProvider`      | Follows the theme, and decides the writing direction                                  |
| `I18nProvider`        | Reads the catalogues in the locale, so it follows it                                  |
| `ViewportProvider`    | Reads the theme's breakpoints, so it follows the theme                                |
| `HotkeysProvider`     | Depends on nothing below it                                                           |

## The two writers of one attribute

`ColorModeProvider` and `ThemeProvider` both own `data-color-mode` on the document root, and
`ThemeProvider` removes it where it is given no mode. `Themed` sits between them, reads the choice,
and passes it on, so the two write the same thing rather than undoing each other. A person following
the machine is passed nothing, which is how both of them spell that.

`Themed` is exported for an application that composes the providers itself and wants the same
bridge.

## The props

`catalogues` and `i18n` reach the i18n provider. `locales` reaches the locale provider. `theme`
reaches the theme provider. `sizes` reaches the viewport. `hotkeys` reaches the shortcuts.
`rootNode` reaches the environment. `store` reaches every setting, so a specification hands one
memory store and the page's local storage is left alone.
