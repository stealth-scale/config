---
adr: 0037
title: Classify a prop by every declaration behind it
status: Accepted
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0008
---

# ADR-0037: Classify a prop by every declaration behind it

## Status

Accepted

## Context

A page draws the axes a theme moves and the options a caller sets. Resolving a `*Props` type gives
every property the component accepts, and almost none of them belong on either list.

Measured on `components/actions/src/button/button.specimen.tsx` under TypeScript 7.0.2,
`ButtonProps` resolves to 1341 properties. 284 have no declaration at all, which is what a mapped
type over the styling conditions produces. 1051 are declared outside the package: the generated
style props, React's own attributes, and the factory's `as` and `unstyled`. The remaining six are
the recipe's axes.

A property can be declared in more than one place, and the checker returns the declarations in an
order it does not promise. On `IconButtonProps`:

| Property          | Declarations, in order                                  |
| ----------------- | ------------------------------------------------------- |
| `aria-label`      | `@types/react`, `button/icon-button.ts`, `@types/react` |
| `aria-labelledby` | `@types/react`, `@types/react`, `button/icon-button.ts` |

The component declares both. The library requires an accessible name on the icon button and nowhere
else, so both belong on its page.

## Decision

We will classify a property by every declaration behind it, and keep the property when any one of
them puts it in a recipe file or in the component's own package.

Four parts follow from that:

- A declaration in `recipe.ts` or `*.recipe.ts` makes the property a variant, the axis a theme
  moves. ADR-0016 set both spellings.
- A declaration in the specimen's own package makes it an option.
- A property with no declaration anywhere is a styling condition and is dropped, so no pattern has
  to name the conditions.
- Both tests use the compiler's own metadata for which package a file belongs to, so the
  classification works without a path written in this repository. What was dropped is served beside
  the props under `dropped`.

## Alternatives Considered

### Take the first declaration and filter the rest with patterns

Classify on `declarations[0]` and remove the noise with lists of regular expressions covering the
styling conditions, the generated style props, the framework's attributes and the props every
component shares. It asks nothing of the compiler beyond the property list.

**Why not:** `declarations[0]` is React's on both `aria-label` and `aria-labelledby`, so both drop
as foreign and the one component in the library that requires an accessible name documents no way to
set it. Four lists is also four things to maintain against a generated file that changes with every
compiler release.

### Take the last declaration

Read the end of the list instead of the front, on the argument that a later declaration refines an
earlier one.

**Why not:** the two properties measured above end differently. `aria-labelledby` ends on the
component and `aria-label` ends on React, in the same type. Either end of the list is a guess about
an order the checker does not promise.

## Consequences

**Positive:**

- A variant survives a style prop of the same name. RFC-0004 gives `List` a `gap` axis, and `gap` is
  already a generated style prop at `foundations/theme/generated/types/system.d.mts:1247`.
- No pattern in the repository names the styling conditions, the style props, the framework's
  attributes or the props every component shares.
- `as` and `unstyled` drop with the rest, because the theme foundation is where they are declared.

**Negative:**

- A property declared in more than one place gets every one of those doc comments merged. Preferring
  one by source was tried and dropped as too fragile to justify the branch.
- A property a component inherits from another package of ours is dropped, because the test is the
  specimen's own package and not the organisation.
- Every declaration of all 1341 properties is read for each part on a page.

**Neutral:**

- A recipe is found by file name, which is the form ADR-0016 already set for a component's files.
