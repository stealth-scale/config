---
adr: 0014
title: Name a plugin for its factory within its package
status: Accepted
date: 2026-09-17
supersedes: none
superseded-by: none
rfc: 0003
---

# ADR-0014: Name a plugin for its factory within its package

## Status

Accepted

## Context

A resolved Vite configuration lists its plugins by name. A reader debugging a build sees the list
and has to work out which package put each plugin there, and which call produced it.

The conformance check on a plugin package asked two things of every plugin a factory returned. The
name had to be `stealth:` followed by the export name, and the plugin had to carry a
`generateBundle` hook. Both held while every plugin in this repository wrote a file at the end of a
build.

The theme packages export their factories inside a namespace, as `theme.runtime` and
`theme.stylesheet`. Neither emits anything at bundle time. Both record the project root when the
configuration resolves, because under a task runner the working directory is the workspace root
rather than the package being built.

Two things we want pull against each other. We want one naming rule that every plugin in this
repository keeps. We also want a plugin that serves a module or generates a file during development
to be a house plugin without pretending to write a bundle.

## Decision

We will name every plugin `stealth:` followed by the path it is exported under within its package,
because a reader of a resolved configuration can then point at the factory that produced it.

Two parts follow from that:

- A factory exported inside a namespace takes the namespace into its name, so `theme.runtime()`
  returns a plugin named `stealth:theme.runtime`.
- The only hook a plugin has to carry is `configResolved`, which is where it reads its root. A
  plugin that writes at `generateBundle` and a plugin that serves at `load` are both house plugins.

`plugin.named` reports a plugin whose name is anything else, and reports each missing hook
separately.

## Alternatives Considered

### Keep the bundle hook in the required set

Go on requiring `generateBundle` of every plugin, which held for every plugin in this repository
when the rule was written and gives the check something concrete to assert.

**Why not:** it asks a plugin that generates a runtime during development, and one that compiles a
stylesheet, to declare a hook they never use. A rule that forces a dead hook stops describing what a
plugin is.

### Name a plugin for its package

Use `stealth:vite-plugin-theme` for every plugin the theme package exports, which is what most Vite
plugin packages do and what the ecosystem's names look like.

**Why not:** the package exports two plugins, and a configuration listing two entries with one name
tells a reader nothing about which call produced which.

### Let a plugin name itself

Drop the naming rule and let each factory choose. Every plugin then reads however its author found
clearest.

**Why not:** a resolved configuration mixes this repository's plugins with the framework's and the
ecosystem's. The `stealth:` prefix is what separates ours at a glance, and a shared suffix rule is
what makes the rest of the name predictable.

## Consequences

**Positive:**

- A name in a resolved configuration points at one export path in one package.
- A plugin that serves or generates rather than emits passes the conformance check without carrying
  a hook it does not use.

**Negative:**

- Renaming an export renames a plugin, so a name that appears in a log or a bug report goes stale.
- The check no longer asserts that a plugin does anything at build time, so a factory returning a
  plugin with only `configResolved` passes while doing nothing.
- A namespaced export makes the name longer, and the namespace has to stay in step with the name by
  hand.

**Neutral:**

- Every plugin in this repository already read its root at `configResolved`, so the narrowed hook
  set records what the code already did.
