---
adr: 0023
title: Name every route and link by reference
status: Proposed
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0006
---

# ADR-0023: Name every route and link by reference

## Status

Proposed

## Context

`examples/app-tanstack` hardcodes `/reports` as the address of a module another deployment exposes.
The host picked that path. The other deployment cannot read it and cannot ask for a different one.

The library checks `<Link to="/reports">` against the registered route tree, which covers routes an
application wrote itself. A route that arrives after the build is not in that tree, so its path is
neither checked nor known to whoever links to it.

An application that locates its parts at run time is in the same position as the parts. Its own
pages have no fixed address either, because where it mounts them is a composition choice.

## Decision

We will give every route an id and resolve a link through a map of those ids, because a path belongs
to whoever assembled the application and an id does not move.

`routeMap` merges what the compiler answered with routes an application named by hand, and refuses
two parts claiming one id. `RouteRef` carries the id and, in its type alone, the parameters the path
names.

## Alternatives Considered

### Link by typed path

`<Link to="/app/invoices/$id" params={{ id }} />`, checked against the registered tree.

**Why not:** it covers only routes an application wrote itself. A part located at run time is
mounted wherever the application put it, which the part cannot read and the application may change.

### Link by bare id string

`<RouteLink to="billing/invoice" />`, resolved through the map at run time.

**Why not:** a typo is a run-time throw and the parameters are untyped. A reference carries both, so
`params={{ id: "42" }}` against a route naming `invoice` is `error TS2353` at the call site. The
bare string stays accepted for callers holding no reference.

## Consequences

**Positive:**

- Re-placing a route moves every link to it at once.
- Filling the wrong parameter is a compile error.
- A page reads its own parameters typed, through the reference it already holds.

**Negative:**

- Every route needs an id, including ones an application wrote itself.
- The map has to reach `routerOptions`, and nothing forces it.
- Resolution throws on an unknown id, a missing parameter, or a tree no router has processed. Three
  run-time failures replace one compile-time check.
- A bare id string bypasses the typing, and nothing stops a caller writing one.

**Neutral:**

- Typed params and typed search are unaffected. Only link paths change.
