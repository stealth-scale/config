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

- Proving a repository takes a build, the checks, and the tests, in that order. The build comes
  first because everything after it reads what the build wrote. A package resolves another package
  by name through the map the packer writes. A checkout that has built nothing has no map. The
  checks come second. They are static and cheap, and they catch the largest class of mistake. The
  tests come last. They are the slowest and the most specific.
- Every CI provider's documentation shows those steps written into a workflow file. That puts the
  only copy of the steps somewhere a laptop cannot run.
- A workflow file drifts from the scripts it copies. It keeps passing after it stops checking
  something.

## Decision

We define `ci` as a task in the configuration. It runs `vp run -r build`, then `vp check`, then
`vp test --run`, with caching off. A cached result describes the tree the cache was written for, not
the tree under test.

## Alternatives Considered

### Spell the steps out in the workflow file

The workflow lists build, check, and test as its own steps. Every provider documents this layout.
Every reviewer recognises it. It keeps the repository's configuration out of a decision about
continuous integration.

**Why not:** a contributor cannot run the workflow. Finding out what it checks means pushing and
waiting. The workflow and the scripts stop agreeing the first time one of them gains a flag.

### Cache the task like every other task

Set `cache: true`. A second run against an unchanged tree then returns at once, and the runner's
fingerprinting does its job here as everywhere else.

**Why not:** the task exists to prove the tree from nothing. A cache cannot return that proof.

### Install and audit dependencies as part of the task

Start the task with an install, so one command takes a clean checkout all the way to a proven tree.

**Why not:** an install commits to a package manager. That choice belongs to the repository, not to
the house. Anything that runs this task has already made it.

## Consequences

**Positive:**

- `vp run ci` runs the same steps on a laptop and under any provider. Laptop and provider cannot
  disagree about what proving the tree means.
- A repository with a different proof takes the layer back by name and states its own.

**Negative:**

- The task cannot bring a checkout to the point where it works. The packages here have to be packed
  first, so a clean clone runs `pnpm run bootstrap` before the task resolves anything. Anything that
  automates this carries that step separately.
- Turning caching off is stated once and inherited silently. A contributor who adds a fourth step
  runs it in full on every run, and nothing reminds them why.

**Neutral:**

- This repository does not run the task on its own. The task defines what proving the tree means.
  Whatever runs the task chooses when to prove it.
- The cache setting applies to the check and test steps. They run every time. The builds inside
  `vp run -r build` are package scripts and keep the workspace's script cache, so a second local run
  replays them. Measured on 2026-09-16. A CI runner has an empty cache, so every step runs there.
