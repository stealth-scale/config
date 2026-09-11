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

Proving a repository takes three steps in an order the steps themselves fix. The build comes first
because everything after it reads what it wrote: a package resolves another by name through the map
the packer writes, and a checkout that has built nothing has no map. The checks come next, being
static, cheap, and the thing that catches the largest class of mistake. The tests come last, being
the slowest and the most specific.

Every CI provider's documentation shows those steps written into a workflow file. That puts the only
copy of them somewhere a laptop cannot run, and a second copy of anything drifts in the direction
nobody watches: the workflow keeps passing while it quietly stops checking something.

## Decision

We will define `ci` as a task in the configuration, running `vp run -r build`, then `vp check`, then
`vp test --run`, with caching off, because a cached answer to "does this tree prove itself" answers
the question about a different tree.

## Alternatives Considered

### Spell the steps out in the workflow file

The workflow lists build, check and test as its own steps. It is what every provider documents, what
every reviewer recognises, and it keeps the repository's configuration out of a decision about
continuous integration.

It lost on where that puts the steps, because a contributor cannot run the workflow and finding out
what it checks then means pushing and waiting. The two copies stop agreeing the first time one of
them gains a flag.

### Cache the task like every other task

Set `cache: true`, so a second run against an unchanged tree costs nothing and the runner's
fingerprinting does its job here as everywhere else.

It lost on what the task is for. Each step inside it is cached already, so a repeat run reuses every
one of those results anyway. This task adds a proof of the tree from nothing, and a cache cannot
return that.

### Install and audit dependencies as part of it

Start the task with an install, so one command carries a clean checkout all the way to a proven tree
with nothing assumed beforehand.

It lost because an install names a package manager. Which one to use belongs to the repository
rather than to the house, and anything running this task has already made that choice to get as far
as running it.

## Consequences

**Positive:**

- `vp run ci` runs the same steps on a laptop and under any provider, so the two cannot disagree
  about what proving the tree means.
- A repository proving itself differently takes the layer back by name and states its own.

**Negative:**

- The task cannot bring a checkout up to the point where it works. Packages here have to be packed
  first, so a clean clone runs `bun run bootstrap` before the task resolves anything, and anything
  automating this carries that step separately.
- Turning caching off is stated once and inherited silently. A contributor adding a fourth step pays
  the full cost of it on every run without being reminded why.

**Neutral:**

- Nothing in this repository runs the task automatically. It defines what proving the tree means;
  choosing when to prove it is left to whatever runs it.
