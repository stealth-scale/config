---
adr: 0020
title: Route with TanStack Router
status: Proposed
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0006
---

# ADR-0020: Route with TanStack Router

## Status

Proposed

## Context

`examples/app-tanstack` builds a router over two routes by calling `createRouter` directly. That is
the only routing in this repository.

One of those two routes, `/reports`, mounts a module another deployment exposes. The host fixes that
address at build time because the other deployment has no way to state where its pages belong.
`federation.host` names its remotes at build time and reads where they are deployed from a document
fetched at run time, so the address is the only part still hardcoded.

Routes therefore fall in two groups: known when the application is built, and arriving after it. No
typegen reads the second group.

## Decision

We will route with TanStack Router, because it types the first group from one declared router type
and exposes `update` as a public method for changing the tree of a running router, which the second
group needs.

## Alternatives Considered

### React Router

Discover routes at run time through `patchRoutesOnNavigation`, which runs when a path fails to
match.

**Why not:** adding a route before anything navigates to it goes through `router.patchRoutes`, which
8.4.0 marks `@private` and `PRIVATE - DO NOT USE` and keeps out of the public entry. Its typegen
reads a `routes.ts` configuration, so it types the first group and reads nothing of the second.

## Consequences

**Positive:**

- The first group keeps typed params, typed search and typed links.
- The second group reaches a running router through a public method.
- `validateSearch` takes a Standard Schema validator, the same mechanism a form's fields use.

**Negative:**

- Every application here peers on one router. Moving off it means rewriting every route tree.
- The library states 48 router options. An application wanting one reads the library, not us.
- The second group is untyped whichever router runs it.

**Neutral:**

- `@tanstack/react-router` was already in the catalogue and already used by an example. This records
  what the repository does.
