/**
 * The `deps` block: what the dev server converts to one module before anything asks for it.
 *
 * Only the dev server reads any of this. A build bundles everything anyway, so what is pre-bundled
 * changes how quickly a page loads while it is being worked on and nothing about what ships.
 *
 * Nothing here states `exclude`, `force` or `noDiscovery`. Excluding a dependency is how a
 * repository breaks a CommonJS one, `force` is a thing to pass on the command line when a cache has
 * gone stale rather than a thing to write down, and turning discovery off trades every crawl for a
 * list somebody has to keep in step.
 */

export { crawled, type Crawled } from "#deps/crawled.ts";
export { prebundled, type Prebundled } from "#deps/prebundled.ts";
