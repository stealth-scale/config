---
adr: 0041
title: Publish the catalogue from the specimen package
status: Proposed
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0008
---

# ADR-0041: Publish the catalogue from the specimen package

## Status

Proposed

## Context

RFC-0008 set the contract as three virtual modules and turned down a viewer of our own: "a viewer is
an application plus an opinion about navigation, routing, layout and search, none of which this
proposal has measured. The contract is the virtual modules. The viewer is deferred to the
documentation space."

The first application to draw a catalogue was then written, and it settled that question by
measurement. What draws the pages is six modules under 51 specifications: a rail grouped by what
each page declares, a page that loads a module and draws its scenes, and the shaping behind both.
None of it names this workspace. Every consumer wanting a catalogue writes the same six modules, or
installs nothing and reads three virtual modules by hand.

The words measure the same way. RFC-0008 gave the catalogue's own words English defaults on props
rather than keys, because that was "one word to override and no message catalogue to keep". It was
sized for three captions on a matrix. A rail heading, an empty state and a landmark are already
three more, and a theme switcher, a colour-mode toggle and a width switcher are a switcher's worth
each. Dozens of strings on props is a catalogue nobody can translate.

What a viewer does need from an application is small and genuinely the application's: which locale
to read in, which themes the page can wear, and where the pages came from.

## Decision

We will publish the catalogue from `@stealthscale/specimen`, because the package a consumer installs
to write a specimen is the package that should draw it, and leave the application the three things
only an application knows.

Four parts follow from that:

- `Catalogue`, `Rail` and `Page` are published beside the authoring surface, with `grouped`,
  `declared` and `parted` as the shaping behind them.
- `Catalogue` takes the pages as a prop rather than importing `virtual:specimen-index`. The package
  then draws a catalogue without the build plugin in its own module graph, and a specification
  renders one without a build at all.
- The catalogue's own words are keys under the `specimen` namespace, in `locales/en/specimen.json`.
  An application renames one by declaring the same key, because the i18n plugin reads packages
  deepest first and the application last.
- The application supplies the providers, the pages the plugin indexed, and the themes the page can
  wear. `@stealthscale/docs` is four files.

## Alternatives Considered

### Keep the viewer in the documentation space

Leave it where RFC-0008 put it, and let each repository draw its own catalogue over the three
virtual modules.

**Why not:** the six modules it takes are the same six in every repository, and none of them names
the repository it belongs to. A consumer installing the authoring surface and then writing the
viewer has installed the smaller half.

### A viewer package beside the authoring one

Publish `@stealthscale/specimen` for what a specimen is written with and a second package for what
draws it, so a component package pulls in no viewer.

**Why not:** a component package declares neither today. A specimen resolves through the workspace
root the way a specification resolves the testing kits, so the authoring surface is already absent
from a component package's manifest. Two packages would split one contract across two release
cadences to save a dependency nobody declares.

## Consequences

**Positive:**

- A consumer installs a catalogue rather than writing one.
- The package renders in a specification without a build, because the pages arrive as a prop.
- The catalogue's words are translatable, and an application renames any of them by key.

**Negative:**

- The package peers on `@stealthscale/component-actions`, `@stealthscale/provider-i18n` and
  `@stealthscale/vite-plugin-specimen` beside what it peered on before. A repository writing
  specimens and drawing no catalogue installs all of them.
- The chrome and the theming pages belong here too, which makes this package much larger than the
  authoring surface it started as.
- RFC-0008 reads as turning this down. The proposal stays as written, and this record is what a
  reader follows.

**Neutral:**

- The three virtual modules are still the contract. This decides who reads them, not what they hold.
