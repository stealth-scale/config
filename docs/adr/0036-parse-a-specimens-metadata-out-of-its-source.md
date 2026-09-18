---
adr: 0036
title: Parse a specimen's metadata out of its source and never evaluate the module
status: Accepted
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0008
---

# ADR-0036: Parse a specimen's metadata out of its source and never evaluate the module

## Status

Accepted

## Context

A catalogue lists every page before it loads one. The listing needs each specimen's identifier, its
group, its title and its opening sentence.

Taking those off the module means importing it. `button.specimen.tsx` imports `Button` from its own
package and `Icon` from the typography package, and both of those import the theme. A listing built
that way loads the library before a reader has opened a page.

Importing also runs module code during an index build. One specimen that throws on import ends the
listing for all of them.

The metadata is string literals and the source text already has them. Vite ships a parser, so
reading them adds no dependency to the plugin.

## Decision

We will read `id`, `group`, `title` and `about` out of the source text with Vite's own parser, and
never evaluate a specimen to build the index.

Three parts follow from that:

- The default export is a call taking one object literal. Neither the callee's name nor the module
  it came from is checked, so a repository supplies its own `specimen` function without configuring
  the plugin with a name to expect.
- A file that matched a pattern but does not declare a page is listed under its path, with the
  reason as its opening and a loader that rejects with the same reason. A build throws instead and
  names every unreadable file in one error.
- The scenes are reached through a dynamic import per page, so the bundler emits one chunk per
  specimen and the listing costs a single module.

## Alternatives Considered

### Evaluate the module and read the export

Import the specimen and read the object its default export produced. There is no parser to write and
no source text to slice, and the metadata is whatever the module says it is.

**Why not:** the listing then costs every component in the library before a reader clicks anything,
and arbitrary module code runs during an index build. One specimen that throws on import takes the
catalogue with it.

### Derive the page from the file path

Take the identifier from the path and the title from the file name, so a specimen declares nothing.

**Why not:** a path is the package layout and an address is the reader's.
`components/actions/src/button/button.specimen.tsx` would resolve to something nobody would choose
to link to. A page also needs a group and an opening sentence, and no path has either.

## Consequences

**Positive:**

- The catalogue's listing loads one module whatever the size of the library.
- A specimen that throws on import still appears, with the reason in place of its opening.
- A repository supplies its own `specimen` function, because the plugin checks no name.

**Negative:**

- A metadata value computed at run time is unreadable. Only string literals are kept, so a computed
  `id` and a missing one produce the same refusal.
- The parser accepts one shape, a default export that is a call with one object literal. A specimen
  wrapping that call in anything else is refused.
- Adding a metadata key is a change to the plugin and not only to the types.

**Neutral:**

- `satisfies` and `as` are unwrapped before the object is read. Both annotate it without changing
  it, and a specimen is commonly written with one.
