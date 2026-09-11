---
adr: 0005
title: Require a reason on every layer but a preset
status: Accepted
date: 2026-09-11
supersedes: none
superseded-by: none
rfc: none
---

# ADR-0005: Require a reason on every layer but a preset

## Status

Accepted

## Context

Four kinds of layer compose a configuration, and they do not all belong to the same author. A
configuration package states a preset on a repository's behalf, setting a coherent block. The
consuming repository states the other three: a contribution appends an item to a list, a removal
takes back a named layer, an override rewrites what the merge produced.

Those three are where a repository departs from the house answer, and a departure nobody accounted
for is the thing a later reader cannot act on. Deleting it risks breaking something, and keeping it
means keeping a rule whose purpose has been lost.

A field required of all four kinds gets filled in by habit, and a reason filled in by habit says
nothing.

## Decision

We will require `because` on contributions, removals and overrides and leave it off presets, because
a reason is worth asking for where a repository departs from the house answer and worth nothing
where it takes one.

A preset's reason belongs to the package stating it, which is where its documentation is.

## Alternatives Considered

### Require a reason on all four kinds

All four kinds then look alike, there is no exception to learn, and the type does not have to tell
anybody which kind is which. The reason for a preset appears at the call site, next to the code it
governs.

It lost on what those strings would say. A preset is this design system's decision rather than the
consuming repository's, so its reason is the same on every call and gets restated at every call site
until nobody reads any of them.

### Require a reason on none of them

Layers have a name and nothing more. A removal already identifies what it takes back, and a name is
most of what a reader chasing a value needs, so the field buys little for what it costs at every
call.

The override is what lost it, because an override rewrites an already merged configuration and is
the least legible thing in the API. A reader can see what it did and has no way to work out what it
was for.

## Consequences

**Positive:**

- Every departure from the house answer states its justification in the tree, next to the departure
  rather than in a commit message.
- A reader deciding whether a relaxation is still needed has the original argument to weigh.

**Negative:**

- The four kinds no longer look alike, so a caller has to know which kind wants a reason. The type
  says so, but only once the call is written.
- The type accepts any string, so the requirement can be met without being kept.

**Neutral:**

- Every entry point in the toolchain already worked this way. The record states the rule rather than
  introducing it.
