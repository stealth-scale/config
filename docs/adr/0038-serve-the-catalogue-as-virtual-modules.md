---
adr: 0038
title: Serve the catalogue as virtual modules with a loader per page
status: Accepted
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0008
---

# ADR-0038: Serve the catalogue as virtual modules with a loader per page

## Status

Accepted

## Context

A catalogue needs three things at three different moments. The listing is needed when the
application starts. A page's scenes, its source and what its parts accept are needed when a reader
opens that page and not before.

A generated file on disk would have to exist before the server starts and be rewritten on every
edit. A real module imported from the application would put every page in the graph, and the bundler
would emit one chunk holding the whole library.

Vite resolves a specifier a plugin claims and serves whatever that plugin returns, which costs the
tree nothing and the application one import.

## Decision

We will serve the catalogue as three virtual modules and reach every page through a dynamic import.

Five parts follow from that:

- `virtual:specimen-index` lists one entry per file, sorted by path. An entry has the metadata, the
  name of the package the file belongs to, and four loaders.
- `virtual:specimen-fragments/<id>` is one snippet per scene, keyed by the scene's title.
- `virtual:specimen-props/<id>` is the parts, the shapes and the dropped counts. It is served where
  the repository states `props` and withheld where it does not.
- A resolved identifier is prefixed with NUL, which is the convention that stops another plugin
  claiming it.
- A page appearing, disappearing or changing its metadata reloads the index. An edit that changes
  only a scene reloads that page and leaves the index alone.

## Alternatives Considered

### Write a generated module to disk

Emit `specimens.generated.ts` into the tree and let the application import it like any other file.
Editors resolve it, types come free, and nothing has to be explained to a reader.

**Why not:** it is a file nobody edits that everyone configures around, in the linter, the
formatter, the coverage report and git. It also has to exist before the first build, so a fresh
checkout fails until something has generated it.

### One module with every page already imported

Serve the index with the scenes imported rather than behind a loader.

**Why not:** the bundler then emits one chunk holding every component in the library, and the
catalogue's first paint waits for all of it. A reader who opens one page has paid for two hundred.

## Consequences

**Positive:**

- The bundler emits one chunk per specimen, and a reader who opens no page loads no component.
- Nothing generated reaches the tree, so no tool has to be told to skip it.
- The props module is optional, so an installation without TypeScript still indexes.

**Negative:**

- A consumer adds the types with a triple-slash directive, because a virtual specifier has nothing
  on disk for an editor to resolve.
- The three specifiers are a published contract. Renaming one breaks every consumer.
- A change to any typed file under a searched directory restarts the compiler and reloads every
  props module already loaded.

**Neutral:**

- The directories the patterns start in are added to the watcher, including those above the project
  root, because a dev server watches its own root and nothing higher.
