# @stealthscale/docs

`@stealthscale/docs` draws the catalogue the specimen plugin indexes. It is the first application in
the workspace to call `specimen.catalogue()`, so it is what proves the plugin against real pages
rather than a scratch workspace.

## Run it

```bash
pnpm --filter @stealthscale/docs dev
```

The server listens on port 4100. The patterns reach across the workspace, so every `*.specimen.tsx`
under `components/*/src` is indexed whether or not this application depends on the package holding
it.

## What it draws

A rail on one side, the open page on the other. The rail lists every page under the group it
declares, with a page that declares none listed last. Choosing a page loads its module, which is the
first time that component reaches the browser.

The index is read at module scope and is fixed for the life of the page. The selection is state
rather than an address, so a reader cannot yet link to a page.

## Still missing

The three virtual modules are the contract, and this reads one of them. `virtual:specimen-fragments`
and `virtual:specimen-props` are already served and nothing here opens them, so a page shows its
scenes and neither its source nor what its parts accept.

The chrome is not here either. A theme switcher, a colour-mode toggle and a width switcher belong to
`@stealthscale/specimen`, and arrive as the components they need land. `theme.config.ts` already
lists all twelve themes, so a switcher has the whole set to move between on the day it exists.

## Licence

MIT. See [LICENSE](LICENSE).
