---
adr: 0012
title: Load theme statements through Vite and inline them for the compiler
status: Accepted
date: 2026-09-17
supersedes: none
superseded-by: none
rfc: 0003
---

# ADR-0012: Load theme statements through Vite and inline them for the compiler

## Status

Accepted

## Context

An application states its themes in `theme.config.ts`. That file imports theme packages and the
application's own presets, and each package publishes its preset under a `./theme` subpath. All of
them are TypeScript modules in a pnpm workspace, resolved through links.

The compiler loads its own configuration in its own process. It resolves neither the workspace links
nor the TypeScript. What a theme and a preset hold are live objects another package exported, which
reading the files as text would not reproduce.

Two things we want pull against each other. We want a theme package to be an ordinary workspace
package with no manifest shape imposed on it. We also want the compiler to receive every theme and
every preset an application depends on.

## Decision

We will load the theme statement and every package's preset through a Vite importer and inline the
result into the configuration handed to the compiler, because Vite already resolves the workspace
links, the TypeScript and the export conditions that the compiler does not.

The arrangement has three parts:

- The plugin opens one importer for the batch, under the application's own export conditions, and
  imports the statement and every contributor's preset through it. Opening an importer without a
  server resolves a configuration and starts a module runner, so a build opens one rather than
  borrowing a server's.
- The configuration handed to the compiler holds the resolved values, not module specifiers. The
  compiler reads no workspace package.
- A theme package therefore needs nothing in its manifest beyond what any package has, and a
  component package publishes its preset under `./theme` and nothing more.

## Alternatives Considered

### Give the compiler an export map it can resolve

Publish each theme and each preset with an export map shaped so the compiler's own configuration
loader resolves it directly. The plugin then hands the compiler specifiers rather than values, and
no import step runs in the plugin.

**Why not:** it constrains the manifest of every theme and component package for one consumer, and
it does not help a workspace package resolved through a link, which is how every package in this
repository is consumed during development.

### Let the compiler configuration import the workspace packages

Write a configuration file that imports the theme packages itself, and let the compiler's loader
handle it.

**Why not:** the compiler's loader runs in its own process without the workspace's resolution. A
configuration that imports a linked TypeScript package fails there, and making it work means
reimplementing what Vite already does.

### Parse the theme files as text

Read the statement and the preset files and extract the values by parsing them, which needs no
module loading at all.

**Why not:** a theme and a preset hold live objects, including functions that a helper returned.
Parsing reproduces the literals and loses everything else.

## Consequences

**Positive:**

- A theme package is an ordinary workspace package. Nothing about its manifest is special.
- A theme resolved through a workspace link behaves the same as one installed from the registry.
- The compiler receives values and reads no workspace package.

**Negative:**

- The compiler cannot be run against an application's configuration from the command line without
  the plugin.
- Opening an importer for a build resolves a second configuration and starts a module runner, which
  is work a build would not otherwise do.
- A failure inside a theme module is reported as an import error from the plugin rather than as a
  configuration error from the compiler, so the message names the wrong layer first.

**Neutral:**

- One importer serves the whole batch, so the statement and every preset share one environment.
