---
adr: 0013
title: Gate a theme on the contract and the contrast table
status: Accepted
date: 2026-09-17
supersedes: none
superseded-by: none
rfc: 0003
---

# ADR-0013: Gate a theme on the contract and the contrast table

## Status

Accepted

## Context

A theme fills twelve roles on every hue palette and on three families, in a light mode and a dark
mode, and it may extend any recipe a package registers. A theme that omits a role compiles, and a
theme that draws an ink too close to its background compiles. Neither failure shows up until someone
looks at a page.

We measured a design system whose contract was documented and enforced in review. Eight of its own
contrast pairs sat below the thresholds set here, and review had passed all of them.

This repository already holds a kit that reports contract breaches as a list of violations, which a
package asserts is empty. That kit covers configuration, plugin and library packages and reaches no
theme.

## Decision

We will gate a theme on the contract and on a contrast table measured in both modes, because a theme
that omits a role or draws an unreadable pair is otherwise found by a person looking at a page.

`@stealthscale/testing-theme` publishes three entry points, each returning a list a specification
asserts is empty:

- `violations(theme, options)` checks the name as an attribute value, then the roles, the modes, the
  references, the extensions, the compounds, the listed files and the styles, then every contrast
  pair.
- `recipeViolations(recipe, options)` reports a class name outside kebab case, a colour a theme
  cannot move, a token or condition the preset does not define, a length in `px`, `rem` or `pt`, a
  colour mode, a slot the anatomy does not stamp, and `fg.subtle` used as a text colour.
- `presetViolations(preset, options)` reports a recipe file the preset's list leaves out, which is
  what makes a hand-written preset safe.

The thresholds are `{ boundary: 3, focus: 3, text: 7 }`. They follow WCAG 2.2 success criterion
1.4.6 for text, which is level AAA, and 1.4.11 for a boundary or a focus indicator, which is level
AA and has no AAA level. `fg.subtle` is held to the boundary ratio and refused as a text colour,
which is why one ink carries a lower threshold than the rest.

## Alternatives Considered

### Document the contract and check it in review

Write the roles, the modes and the contrast table into the contributing guide, and hold a theme to
them when reading a pull request. No kit, no specification per theme.

**Why not:** we measured a system that worked this way and found eight of its own pairs below
threshold. A reviewer cannot compute a contrast ratio by reading a diff.

### Take the AA thresholds

Hold text to 4.5:1 rather than 7:1, which is what most design systems target and what the law
requires in most jurisdictions.

**Why not:** the ramps this foundation ships clear 7:1 at the steps the twelve roles assign, so the
higher threshold costs nothing. Lowering a threshold passes every theme that already met it, and
raising one breaks them. A theme that cannot reach 7:1 is a theme whose ramp needs a step moved.

### Check contrast with a lint rule

Write an Oxlint rule that reads colour values and computes ratios at the point they are written.

**Why not:** a rule sees one file. A contrast pair is an ink from one file measured against a
surface from another, after references resolve and both modes are filled in.

## Consequences

**Positive:**

- A theme that omits a role, or that draws an unreadable pair, fails its own package's gate.
- The failure names the pair and the measured ratio, so the fix is a ramp step rather than a hunt.
- A hand-written preset is as safe as a generated one, because the check reads the recipe files.

**Negative:**

- The 7:1 threshold rejects ramp steps that read well to the eye, so a theme author meets the gate
  rather than their own judgement.
- Every theme package and every component package carries a specification it would not otherwise
  need.
- The contrast checks resolve references and fill both modes before measuring, which is the slowest
  part of a theme package's test run.
- A theme cannot ship a deliberately low-contrast surface, such as a watermark, without turning a
  check off by name.

**Neutral:**

- The kit returns a list of violations rather than calling the test framework itself, which is how
  every other conformance kit in this repository works.

## References

| What                                        | Where                         |
| ------------------------------------------- | ----------------------------- |
| WCAG 2.2, success criteria 1.4.6 and 1.4.11 | https://www.w3.org/TR/WCAG22/ |
