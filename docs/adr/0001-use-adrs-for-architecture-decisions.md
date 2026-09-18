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

- This repository decides things that constrain every repository built on it: where a layer is
  stated, which layers require a reason, and what separates one tier from another.
- Those arguments are written in docblocks beside the code that enforces them. A docblock is the
  right place for a reader at that line. It is the wrong place for a reader who is deciding whether
  to change the rule.
- A docblock moves with its file and is deleted with its file. The layer kernel was extracted from
  `vite-config` into its own package, and the module that explains why a preset does not require a
  reason moved with it. If that file is deleted, the explanation is deleted with it. The rule then
  has no recorded reason, and the next contributor is free to drop it.

## Decision

We record architecture decisions as ADRs under `docs/adr/`. A decision that is still in force after
its file is gone needs a home that does not depend on that file.

A docblock keeps its own explanation, because the two documents serve different readers. The reader
at the line needs the docblock. The reader who proposes a change needs the record.

## Alternatives Considered

None. This decision is a process bootstrap.

## Consequences

**Positive:**

- Deleting the code that enforces a decision no longer deletes the reason for the decision.
- A contributor who wants a rule relaxed can read what the rule cost before proposing the change.

**Negative:**

- The docblock and the record argue the same decision. No check compares them.
- Each decision of this size costs one file and one review. A docblock costs neither.

**Neutral:**

- The practice is older than the directory. Decisions were already argued in docblocks. The records
  give them a location outside the source tree.
