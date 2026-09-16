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

- Four kinds of layer compose a configuration, and they do not all have the same author. A
  configuration package states a preset on a repository's behalf, and the preset sets a coherent
  block. The consuming repository states the other three kinds. A contribution appends an item to a
  list. A removal takes back a named layer. An override rewrites what the merge produced.
- Those three kinds are where a repository departs from the house answer. A departure without a
  recorded reason is one a later reader cannot act on. Deleting it risks breaking something. Keeping
  it means keeping a rule whose purpose is lost.
- A field required on all four kinds gets filled in by habit, and a reason filled in by habit
  carries no information.

## Decision

We require `because` on contributions, removals and overrides, and we leave it off presets. A reason
is worth asking for where a repository departs from the house answer. It is worth nothing where a
repository takes the house answer.

A preset's reason belongs to the package that states the preset, in that package's documentation.

## Alternatives Considered

### Require a reason on all four kinds

All four kinds look alike. There is no exception to learn, and the type does not have to tell
anybody which kind is which. The reason for a preset appears at the call site, next to the code it
governs.

**Why not:** a preset is the design system's decision, not the consuming repository's. Its reason is
the same at every call site. Restated at every call site, it stops being read.

### Require a reason on none of them

Layers have a name and nothing more. A removal already identifies what it takes back, and a name is
most of what a reader who is tracing a value needs, so the field buys little for what it costs at
every call.

**Why not:** the override. An override rewrites an already merged configuration, and it is the least
legible thing in the API. A reader can see what an override did and has no way to work out what it
was for.

## Consequences

**Positive:**

- Every departure from the house answer states its justification in the tree, next to the departure
  and not in a commit message.
- A reader who is deciding whether a relaxation is still needed has the original argument to weigh.

**Negative:**

- The four kinds no longer look alike. A caller has to know which kind wants a reason. The type says
  so, but only once the call is written.
- The type accepts any string. The requirement can be met without being kept.

**Neutral:**

- Every entry point in the toolchain already worked this way. The record states the rule. It does
  not introduce the rule.
