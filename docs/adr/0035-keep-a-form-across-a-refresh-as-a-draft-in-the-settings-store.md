---
adr: 0035
title: Keep a form across a refresh as a draft in the settings store
status: Proposed
date: 2026-09-18
supersedes: none
superseded-by: none
rfc: 0007
---

# ADR-0035: Keep a form across a refresh as a draft in the settings store

## Status

Proposed

## Context

A person who refreshes the page, or whose tab is restored after a crash, loses what they typed.
Saving a partly filled form on a server is a collection, which the data foundation holds, and this
is not that.

The settings foundation publishes `SettingStore` with `localStore`, `memoryStore` and `cookieStore`,
and `settingKey(app, name)`. TanStack Form's `FormListeners.onChange` takes `onChangeDebounceMs`,
and `FormApi.update` applies changed default values to an untouched form, in `FormApi.js` line 94. A
draft read through `useSyncExternalStore` with a server snapshot of nothing agrees with hydration.

## Decision

We will keep a draft in a `SettingStore`, local storage where an application states none, under
`settingKey(app, "form.<id>")`, written by the form's own change listener and holding a hash of the
schema, the step and the values. A draft typed against another schema is dropped. A value at a path
the schema marks `format: "password"` or `x-persist: false` is never written, and `defaultsOf` fills
it back in. The draft is the form's default value written over the schema's, so the render after
hydration carries it in and `form.reset()` returns to it. A submit handler that returns forgets the
draft.

`useSchemaForm({ draft: { app, id?, store? } })` wires all of it. The draft's identifier is the
form's where the scope states none, and an edit form makes one from the record's identifier.

## Alternatives Considered

### A store of the form foundation's own

Read and write local storage in the form foundation.

**Why not:** the settings foundation already keys, reads, writes and notifies across tabs, and a
cookie store already exists where a server needs to read. A draft kept beside the application's
other settings means two applications on one origin keep their own.

### The draft in the form's default state

Write the draft into `defaultState` rather than `defaultValues`.

**Why not:** `defaultValues` is what `form.reset()` returns to and what `update` applies to an
untouched form. A draft as the default value is the form as the person left it, reset included.

### Keeping the password with everything else

**Why not:** the default store is local storage, which outlives the tab. A password or a card number
in it is a defect, and the schema already marks the field.

## Consequences

**Positive:**

- A refresh finds the values and the step as the person left them.
- A draft of one record never opens over another, and a draft typed against an older schema is never
  applied to fields that no longer exist.
- A specification passes a memory store and reads what was written.

**Negative:**

- A person reopening a tab days later finds the values they typed, because local storage outlives
  the tab. A session-storage store does not exist in the settings foundation yet.
- A record that changes on the server while a draft is open is not detected. An application that
  needs that puts the record's version into the draft's identifier.

**Neutral:**

- `useDraft` given no options keeps nothing and reports nothing, so a hook that may or may not keep
  a draft calls it on every render.
