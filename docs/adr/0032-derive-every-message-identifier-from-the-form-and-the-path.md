---
adr: 0032
title: Derive every message identifier from the form's identifier and the path
status: Proposed
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0007
---

# ADR-0032: Derive every message identifier from the form's identifier and the path

## Status

Proposed

## Context

A form generated from a schema shows labels, help text, placeholders, legends, step labels, the
words on its buttons and error messages. A generated form has nowhere to write them, and a plugin's
form is drawn by a host in the host's language.

i18next 26.4.2's `t` takes a key or a list of keys, tries them in order, returns `defaultValue`
where none is found, and interpolates the default as it interpolates a found message, read in
`dist/esm/i18next.js` lines 802 to 803, 662 to 665 and 718. Its typed signature keeps a
`string | string[]` overload beside the typed keys wherever `defaultValue` is present.

The engine's issue carries the keyword that refused and the values the keyword measured, under the
engine's own names.

## Decision

We will derive every message identifier from the form's identifier and the path: a label is
`<id>.fields.<path>.label`, a legend `<id>.groups.<name>.legend`, an action `<id>.actions.<name>`,
and a failure `<id>.errors.<path>.<keyword>` and then `errors.<keyword>` for the whole product. An
index in a path is collapsed to `[]`, so one identifier covers every row of a repeat group.

The translator is a function with i18next's signature, `(keys, { defaultValue, ...values })`, so an
application hands in its `t` as it is. One call reads the catalogue at the derived keys and falls
back to the schema's `title` or `description`, the engine's message or the path written out.
`translateFrom` and `untranslated` interpolate `{{name}}` as i18next does. The foundation imports no
i18n library, and a form runs before anybody translates it.

Every identifier is computable without rendering the form. `catalogue` therefore lists them with the
schema's English beside each.

## Alternatives Considered

### Literal strings in the presentation, translated by the caller

`label: "VAT number"`, and a caller wraps the words.

**Why not:** a caller cannot wrap what a generated form produced, because the strings are inside it.
A form that states a literal somewhere is a form somebody has to find again when the product is
translated.

### A translator of our own, answering nothing for a missing key

`(id, values) => string | undefined`, with the fallback chain in the foundation.

**Why not:** i18next's `t` never answers nothing, and an adapter would stand between every
application and its own `t`. The library's `defaultValue` and key list are the chain already.

### Message values renamed to names of our own

Rename the engine's `minLength` to `min` in every failure.

**Why not:** a second table of names to publish and keep, and a translator writing `{{min}}` for one
engine and `{{minLength}}` for another. The engine's names are the ones a message reads.

## Consequences

**Positive:**

- A form with `id: "checkout"` and a field at `billing.vat` reads
  `checkout.fields.billing.vat.label` with no configuration.
- A translator receives a complete catalogue for a form nobody has rendered.
- A label shared across forms names its identifier in `fields[path].label`. The form's other
  identifiers are unchanged.

**Negative:**

- A derived identifier changes when a field is renamed, and the translations under the old one are
  orphaned. `fields[path].label` keeping the old identifier is the tool for it.
- A message reads the engine's own value names, so a change of engine changes what a catalogue may
  read.

**Neutral:**

- A hand-written form states its own words through a component's `label` prop, outside this scheme.
