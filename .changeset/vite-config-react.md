---
"@stealthscale/vite-config-react": minor
---

Compile MDX documents into components. `layers({ mdx: true })` adds `plugin.mdx()`, which puts
`@mdx-js/rollup` ahead of every other plugin and gives the packer the same plugin under
`pack.plugins`. The plugin compiles `.mdx` only, so a markdown file imported with `?raw` stays a
string. `./mdx` publishes the declaration file a package references from its `globals.d.ts`: it
declares the `*.mdx` module and types the elements a document renders against React's JSX.
`@mdx-js/rollup` and `@types/mdx` are optional peers.
