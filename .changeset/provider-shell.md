---
"@stealthscale/provider-shell": minor
---

provider-shell: compose every provider an application renders

- `Shell` puts the root node, the colour mode, the theme, the locale, the catalogues, the viewport
  and the shortcuts in scope, in the order each depends on the one before. `app` is the only
  required prop.
- Routes and data stay the application's own. It renders its router and its clients as children, so
  an application without either bundles neither.
- `ColorModeProvider` and `ThemeProvider` both own `data-color-mode` on the document root, and the
  theme provider removes it where it is given no mode. `Themed` sits between them, reads the choice
  and passes it on, so the two write the same value rather than undoing each other. A person
  following the machine is passed nothing, which is how both providers represent that choice.
- `store` reaches every setting, so a specification passes one memory store and the page's local
  storage is left alone.
