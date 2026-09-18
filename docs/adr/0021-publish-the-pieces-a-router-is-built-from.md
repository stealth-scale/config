---
adr: 0021
title: Publish the pieces a router is built from
status: Proposed
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0006
---

# ADR-0021: Publish the pieces a router is built from

## Status

Proposed

## Context

`RouterOptions` states 48 members, among them `basepath`, `routeMasks`, `trailingSlash`,
`defaultSsr`, `rewrite` and `notFoundMode`. A factory that calls `createRouter` decides which of
them an application may reach.

`createRouter` is `CreateRouterFn`, generic over the route tree and four further parameters. A
factory either reproduces all five or answers a router over `AnyRoute`. Registering a router over
`AnyRoute` as the application's router type drops the checking on `useParams`, `useSearch` and
`Link`.

## Decision

We will publish the options, the compiler and the resolvers as separate pieces and let an
application call `createRouter` itself, because an object spread into the library's own call leaves
every option the caller's and every generic the library's.

`routerOptions` answers three defaults and the router context. A caller spreads it first, and
anything set after it wins.

## Alternatives Considered

### A factory that builds the router

`createAppRouter({ layouts, routes, routeTree, under })` answers a configured router, so an
application makes one call and learns one surface.

**Why not:** it exposes the options it thought of and hides the other 40-odd, so reaching `basepath`
means adding a pass-through for each one. It also has to reproduce five type parameters or give up
the typing the library was chosen for. The spread costs four characters at one call site.

## Consequences

**Positive:**

- All 48 library options remain reachable. A release that adds one needs no change here.
- The application passes the generic to `createRouter`, so its own routes keep their types.
- Each piece is a pure function or a plain object, and tested on its own.

**Negative:**

- An application writes four lines it would not write against the library alone: the spread, the
  root route factory, the map, and the module augmentation.
- An application with all its routes in code gains three default options and nothing else.
- Nothing forces the route map into the options. Forgetting it throws when the first link by id
  renders, not when the router is built.

**Neutral:**

- The library is re-exported under this package's name, so an application imports the router from
  one place.
