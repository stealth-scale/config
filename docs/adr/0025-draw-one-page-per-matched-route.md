---
adr: 0025
title: Draw one page per matched route
status: Proposed
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0006
---

# ADR-0025: Draw one page per matched route

## Status

Proposed

## Context

A declaration may ask to be drawn as a pane beside another page rather than as the page itself. The
compiler has to either honour that or refuse it.

The library draws one page per matched route. `Outlet` is a memoised component over
`() => JSX.Element | null` and takes no props, so there is no name to address a second pane by. Two
`Outlet` elements in one component draw the same child twice, measured as `LIST`, `DETAIL`,
`DETAIL`.

A pane whose content varies independently of the URL's path is therefore not a route match. It would
be a component chosen by search state.

## Decision

We will draw one page per matched route and refuse a declaration that states an outlet, because the
route decides what the page shows and a pane beside it has no route to be.

## Alternatives Considered

### Draw the pane from search state

The foundation declares a search key naming which declaration is in which pane, and renders it.

**Why not:** a pane page is not matched, so the router runs none of its lifecycle over it and its
parameters would come from the search. Supplying the loader, the condition check and the error
boundary is a second mechanism beside the router.

### Compile the field as though it were absent

Ignore `outlet` and draw the page as the whole content.

**Why not:** a page that asked to be a pane and was drawn full width is wrong in a way nobody
notices until a person reports it.

## Consequences

**Positive:**

- A detail beside a list is a child route. The list lays out its own content beside `Outlet`, and
  the pane gets a URL, the back button and preloading. Measured: a declared detail under a declared
  list drew both.
- The refusal names the route and the field at boot.

**Negative:**

- A declaration source that states outlets cannot be compiled here until it stops, or until a pane
  mechanism exists.
- A page showing two panes that vary independently is not expressible at all.

**Neutral:**

- `RouteDeclaration` keeps the `outlet` field so the refusal can name it. Removing the field would
  make an outlet an unknown member, ignored in silence.
