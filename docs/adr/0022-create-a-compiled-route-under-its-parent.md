---
adr: 0022
title: Create a compiled route under its parent rather than grafting it into a built tree
status: Proposed
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0006
---

# ADR-0022: Create a compiled route under its parent rather than grafting it into a built tree

## Status

Proposed

## Context

Routes that arrive as data have to reach the tree an application wrote. Grafting is the short way:
hand the compiler a route to hang them under and let it call `addChildren` there.

Three library behaviours make grafting unsafe.

- `addChildren` is `this.children = children; return this`. It replaces the children and mutates the
  route it is called on.
- On a server outside development the processed tree is cached in `globalThis.__TSR_CACHE__`, keyed
  by the tree object and written only where the cache is undefined.
- A route's parent comes from its own `getParentRoute` closure, not from the traversal.

A second router built from a mutated tree therefore reads from the cache. Measured with one route
grafted between two routers:

| `NODE_ENV`    | What the second router listed                              |
| ------------- | ---------------------------------------------------------- |
| unset         | `__root__`, `/app`, `/app/home`, `/app/alpha`              |
| `development` | `__root__`, `/app`, `/app/home`, `/app/alpha`, `/app/beta` |
| `production`  | `__root__`, `/app`, `/app/home`, `/app/alpha`              |

Cloning the spine does not help. A copied route's children resolve their parent through the closure
they were created with, so a reused `home` registered as `/home` rather than `/app/home`.

## Decision

We will create every compiled route under the parent it belongs to and assemble the tree once,
because a grafted tree keeps the identity the process cache is keyed by.

The compiler takes the parent, answers routes for the caller to place, and mutates nothing the
caller owns.

## Alternatives Considered

### Graft under a named route

`compileRoutes(declarations, { under: shellRoute })` finds the place and calls `addChildren` there.

**Why not:** a server answering two requests from one process routes the second by the first
request's tree, under `NODE_ENV=production` and not under `development`.

### Clone the spine before grafting

Copy the routes from the root to the graft point, so the caller's tree is untouched and the new tree
has a fresh identity.

**Why not:** copied children keep their original parent closure, so their ids are computed from the
wrong parent. The route matches by URL and misses by id.

## Consequences

**Positive:**

- Two routers in one process answer their own routes, measured under `NODE_ENV=production`.
- Compiled routes can be placed in more than one spot, which one graft point cannot express.

**Negative:**

- An application holds its tree-building as a function rather than a module constant. Nothing in the
  type system enforces that.
- The application places the routes itself, one line more than naming a graft point.
- Anyone adding a grafting convenience reintroduces the failure, and only production shows it.

**Neutral:**

- The compiler reads the caller's existing children to refuse a path they already answer. It looks
  at the tree without changing it.
