/**
 * A library that generates part of what it publishes.
 *
 * @remarks
 *   The stylesheet at `./tokens.css` is not in the source tree. A build hook
 *   writes it from the palette, and the export map is computed from the same
 *   map the hook writes, so the subpath and the file it names cannot drift
 *   apart.
 * @packageDocumentation
 */

export { PALETTE, stylesheet, TOKEN_EXPORTS } from "#palette.ts";
