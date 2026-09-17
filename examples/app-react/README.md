# @stealthscale/example-app-react

`@stealthscale/example-app-react` renders one React component and one MDX page in a browser. Every
layer in its configuration comes from a call the application preset already knows how to compose,
and the file states nothing of its own beyond the port and the one document format. A new
application copies this file and changes the port.

## Run it

```bash
pnpm --filter @stealthscale/example-app-react dev
pnpm --filter @stealthscale/example-app-react test
```

`vp test` renders `Badge` into a happy-dom document and reads the text back out of it. It renders
`notes.mdx` the same way and reads the heading, the list and the badge the page imports. The
development server answers on port 4300 and refuses to start when something else already has it.

## The configuration

The package extends `@stealthscale/vite-config/preset/app`, the tier for a browser application that
is deployed rather than published. The file adds four calls beside it.

- `react.layers({ mdx: true })` contributes five layers: the plugin that compiles JSX through the
  automatic runtime, a setup file that empties the document between tests, the happy-dom environment
  the runner loads, and the MDX plugin twice, once ahead of every other plugin and once for the
  packer. It contributes no rule and no format, because a linter and a formatter read the workspace
  root configuration only.
- `css.layers()` appends one plugin that runs Stylelint over the stylesheets this package imports.
  It runs during a build and behind the development server alike, and a rule you change applies on
  the next run rather than after a cache is thrown away.
- `define.manifest()` substitutes `__NAME__` and `__VERSION__` into the bundle. Both values come
  from the manifest the composer supplies rather than from disk.
- `server.port(4300)` pins the development server and fails its start on a taken port instead of
  searching upward for a free one.

## The build stamp

`Badge` reads `__NAME__` and `__VERSION__`. Both are literals in the substituted output, so the
component prints them without consulting a manifest at run time. `src/globals.d.ts` declares the two
identifiers with a reference directive, and a second directive in the same file declares the `*.mdx`
module `notes.mdx` is imported as. Such a directive takes effect only from a file the program
already includes. That file exists to be included. Without it both identifiers are undeclared and
the `.mdx` import is unresolved, and the build fails to compile rather than rendering an empty
badge.
