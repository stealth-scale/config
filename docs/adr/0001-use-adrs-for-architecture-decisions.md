---
adr: 0001
title: Use ADRs for architecture decisions
status: Accepted
date: 2026-09-11
supersedes: none
superseded-by: none
rfc: none
---

# ADR-0001: Use ADRs for architecture decisions

## Status

Accepted

## Context

This repository decides things that constrain every repository built on it: where a layer is stated,
what requires a reason, what separates one tier from another. Those arguments are written into
docblocks beside the code enforcing them, which is the right place for a reader at that line and the
wrong place for a reader deciding whether to change it.

A docblock moves when its file moves, and disappears when its file does. The layer kernel has
already been extracted from `vite-config` into a package of its own, taking the module that argues
why a preset needs no reason along with it. Delete that file and the argument goes too, which leaves
a rule nobody can account for and the next contributor free to drop it.

## Decision

We will record architecture decisions as ADRs under `docs/adr/`, because a decision still in force
after its file is gone needs a home independent of that file.

A docblock keeps its argument, because the two answer different readers. Somebody reading that line
needs what the docblock says; somebody proposing to change the rule needs what the record says.

## Alternatives Considered

None. This is a process bootstrap.

## Consequences

**Positive:**

- Deleting the code that enforced a decision no longer deletes the reason for it.
- A contributor who wants a rule relaxed can read what it cost before proposing the change.

**Negative:**

- Two documents now argue the same decision, and nothing checks that they still agree.
- Every decision of this size costs a file and a review, which is friction the docblock did not
  have.

**Neutral:**

- The practice is older than the directory. Decisions were already argued in docblocks; the records
  give them a location independent of the source tree.
