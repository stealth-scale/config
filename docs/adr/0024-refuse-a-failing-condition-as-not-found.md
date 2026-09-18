---
adr: 0024
title: Refuse a failing condition as not-found
status: Proposed
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0006
---

# ADR-0024: Refuse a failing condition as not-found

## Status

Proposed

## Context

A declaration may state when its route is routed at all: a flag, a permission, a role, or whatever
the application writes conditions in. The compiler has to decide what a failing condition does when
somebody opens the URL.

Three answers were on the table: a 404, a redirect, and a rendered refusal. They differ in what they
tell a person who is not meant to be there. A refusal confirms the page exists.

The condition's language is the application's. This package cannot read a session and states nothing
about what a condition may say.

## Decision

We will throw `notFound()` from `beforeLoad` where the evaluator answers false, because a route
nobody may reach does not exist.

An evaluator wanting anything else throws the library's own `redirect` itself. Sending an
unauthenticated person to sign in is the case that needs it.

## Alternatives Considered

### Redirect on failure

`beforeLoad` throws `redirect` to a route the application names.

**Why not:** it fits one condition, not the rest. A page hidden behind a feature flag has nowhere to
redirect to. Leaving the throw to the evaluator covers both, because the evaluator knows which
condition failed and this package does not.

### Render a refusal

The route matches and draws a "not permitted" page.

**Why not:** it confirms the page exists to somebody who may not know that.

### A registry of named guards

A declaration states `when: "signed-in"` and the application registers a guard under that name.

**Why not:** a name is a second language beside whatever the condition is already written in, and a
declaration naming a guard nobody registered is a failure a plain value does not have.

## Consequences

**Positive:**

- One answer for every condition, whatever the application writes them in.
- The sign-in case is still served, by a `redirect` the evaluator throws.
- `Evaluate<Condition>` is generic, so this package states nothing about the condition language.

**Negative:**

- A condition decides whether a route is routed, not whether it is named. A route whose condition
  fails is still in the tree and still in the map, so a menu drawn from declarations has to filter
  them with the same evaluator or render a link that 404s.
- An application wanting a refusal page builds it outside this package.
- `compileRoutes` refuses a declaration stating a condition when no evaluator was given, which is
  one more way a compilation stops at boot.

**Neutral:**

- The evaluator runs per navigation, inside `beforeLoad`, wherever the application resolves its
  session.
