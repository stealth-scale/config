---
adr: 0004
title: Name the CI steps in the config and never cache them
status: Accepted
date: 2026-09-11
supersedes: none
superseded-by: none
rfc: none
---

# ADR-0004: Name the CI steps in the config and never cache them

## Status

Accepted

## Context

- Proving a repository takes three steps, and the steps fix their own order. The build comes first,
  because everything after it reads what the build wrote: a package resolves another package by name
  through the map the packer writes, and a checkout that has built nothing has no map. The checks
  come second. They are static, cheap, and catch the largest class of mistake. The tests come last.
  They are the slowest and the most specific.
- Every CI provider's documentation shows those steps written into a workflow file. That puts the
  only copy of the steps somewhere a laptop cannot run.
- A second copy of anything drifts. The workflow keeps passing while it stops checking something.

## Decision

We define `ci` as a task in the configuration. It runs `vp run -r build`, then `vp check`, then
`vp test --run`, with caching off. A cached answer to the question "does this tree prove itself" is
an answer about a different tree.

## Alternatives Considered

### Spell the steps out in the workflow file

The workflow lists build, check and test as its own steps. Every provider documents this shape,
every reviewer recognises it, and it keeps the repository's configuration out of a decision about
continuous integration.

**Why not:** a contributor cannot run the workflow. Finding out what it checks means pushing and
waiting. The two copies stop agreeing the first time one of them gains a flag.

### Cache the task like every other task

Set `cache: true`, so a second run against an unchanged tree costs nothing and the runner's
fingerprinting does its job here as everywhere else.

**Why not:** the task exists to prove the tree from nothing. A cache cannot return that proof.

### Install and audit dependencies as part of the task

Start the task with an install, so one command carries a clean checkout all the way to a proven
tree.

**Why not:** an install names a package manager. Which package manager to use belongs to the
repository, not to the house. Anything that runs this task has already made that choice.

## Consequences

**Positive:**

- `vp run ci` runs the same steps on a laptop and under any provider. The two cannot disagree about
  what proving the tree means.
- A repository with a different proof takes the layer back by name and states its own.

**Negative:**

- The task cannot bring a checkout to the point where it works. The packages here have to be packed
  first, so a clean clone runs `pnpm run bootstrap` before the task resolves anything. Anything that
  automates this carries that step separately.
- Turning caching off is stated once and inherited silently. A contributor who adds a fourth step
  runs it in full on every run, and nothing reminds them why.

**Neutral:**

- Nothing in this repository runs the task automatically. The task defines what proving the tree
  means. Choosing when to prove it is left to whatever runs the task.
- The cache setting applies to the check and test steps, which run every time. The builds inside
  `vp run -r build` are package scripts and keep the workspace's script cache, so a second local run
  replays them. This was measured on 2026-09-16. A CI runner starts with no cache, so every step
  runs there.
