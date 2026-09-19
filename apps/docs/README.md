# @stealthscale/docs

`@stealthscale/docs` hosts the catalogue. It is the first application in the workspace to call
`specimen.catalogue()`, so it is what proves the plugin against real pages rather than a scratch
workspace.

## Run it

```bash
pnpm --filter @stealthscale/docs dev
```

The server listens on port 4100. The patterns search across the workspace, so every `*.specimen.tsx`
under `components/*/src` is indexed whether or not this application depends on the package holding
it.

## What is here

Five files and a manifest. The application settles the locale, loads the catalogues, compiles the
pages the plugin indexed into routes, and states which themes the page can wear.

```
src/app.tsx          the providers and the router
src/routes.tsx       the tree the indexed pages are compiled into
src/main.tsx         the mount
theme.config.ts      the twelve themes, and static: "*"
vite.config.ts       the layers
```

Everything drawn below belongs to `@stealthscale/specimen`, which defines the rail, the page, the
frame around them and the route declarations. A consumer installs a catalogue rather than writing
one.

The pages are mounted under `/pages`, and the site root redirects to the first page the index found.
That path is this application's choice: `declarations` carries no leading slash, so moving the mount
moves every address with it.

`src/routes.tsx` concatenates before it compiles. Today that list is the indexed pages alone, and a
theming page or a written page this application adds goes in beside them, carrying a `navigation`
entry so the rail lists it under its own heading.

## The host's own decisions

`theme.config.ts` states `static: "*"`, which compiles every recipe outright. The compiler extracts
a value written as a JSX literal and nothing it reads from a prop, so without it a scene drawing
`variant={one}` renders every look, size and status alike. A product application states nothing
there.

The twelve themes are listed so a switcher has the whole set to move between on the day one exists.

Any word the kit writes can be renamed here by declaring the same key under the `specimen`
namespace. The plugin reads packages deepest first and this application last.

## Still missing

The three virtual modules are the contract, and this reads one of them. `virtual:specimen-fragments`
and `virtual:specimen-props` are already served and nothing opens them yet, so a page shows its
scenes and neither its source nor what its parts accept.

The chrome is missing too. A theme switcher, a colour-mode toggle and a width switcher belong to
`@stealthscale/specimen`, and arrive as the components they need land.

## Licence

MIT. See [LICENSE](LICENSE).
