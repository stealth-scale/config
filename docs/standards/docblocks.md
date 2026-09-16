# Doc comments

Write a doc comment on every function, on every arrow function assigned inside a function, on every
type, on every interface member, and on every module-level constant, exported or not.

```ts
/**
 * Resolves the workspace globs a manifest declares.
 *
 * @remarks
 *   Each format is read in turn. The first one present supplies the answer. Undefined means the
 *   directory is not a workspace root. An empty array means it is a workspace root that declares
 *   no packages.
 * @param at - The directory holding the manifest.
 * @param manifest - The parsed package.json found at that directory.
 * @returns Each declared glob, or undefined outside a workspace root.
 * @throws {@link Error} When pnpm-workspace.yaml exists and cannot be read.
 */
```

`vp check` enforces the syntax, the coverage and the tag vocabulary. This document covers what it
cannot see. The standard is TSDoc, and the rule set is in
`packages/vite-config/src/lint/rules/docblock.ts`.

## The summary line

Open on a third-person verb and write one complete sentence. Do not restate the identifier.

| Rejected                                                              | Written out                                                                         |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `Whether a value satisfies a schema, narrowing it to the input type.` | `Returns true when the schema accepts the value, and narrows it to the input type.` |
| `Every refusal, in schema order.`                                     | `Lists every refusal in the order the schema reported them.`                        |
| `The schemes a link may use.`                                         | `Lists the schemes a link may use.`                                                 |
| `A widget frame with a grip and a control row.`                       | `Draws a widget frame holding a grip and a control row.`                            |
| `Reports why a component's render failed.`                            | `Reports whether a component rendered, and why it did not.`                         |

A noun phrase standing where a sentence belongs is the failure this repository has rejected most
often. The last row shows the second most common one. A summary that names one branch describes half
the function. Cover every outcome it reports.

## The paragraph

The summary is followed by at most one short paragraph under `@remarks`, and it carries what the
code cannot show: a decision, a constraint, or a measured consequence. A prop gets one line, or none
where its name is self-explanatory.

Everything before the first tag is the summary. An index page lists only that summary, and the
detail page shows the remarks below it. Leave the paragraph untagged and the index listing shows the
whole block.

Name the actor in every sentence. A sentence whose subject you cannot point at has hidden it in a
noun. No tool reports this.

A paragraph fails in four ways. All four read well enough that a reviewer accepts them.

**It restates what the name already implies.** A reader of `classNames` already knows the function
is about merging.

| Rejected                                                                                           | Written out                                                                                                                                                                                 |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `A conforming component merges a caller's className into its own rather than dropping either one.` | `A component can fail this in two ways. One that never reads the prop drops the caller's class. One that reads it and assigns it drops its own. The second looks correct at the call site.` |

**It lists the functions the body calls.** A reader gets that list from the body. The paragraph goes
stale on the next check somebody adds.

| Rejected                                                                                                                                                                           | Written out                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Lists every way a component fails: rendering without throwing, merging a className, forwarding a ref and unknown props, and whichever of children or asChild the options enable.` | `The first check establishes that there is an element to read at all. When it fails, the result contains that one entry and nothing else, because no later check can run without an element.` |

**It names the mechanism instead of the guarantee.** A caller acts on the guarantee. The body shows
the mechanism.

| Rejected                                                                                                             | Written out                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `The unmount happens in a finally block, so a read that throws still leaves the container clean for the next check.` | `The component is unmounted even when read throws, so one check never reads the element another check rendered.` |

**It repeats a block that already exists.** A paragraph on `drawn` describing `options.wrapper` says
what the `wrapper` member's own doc comment says. Move the condition into the summary and delete the
paragraph, so the block reads `Renders a component, inside options.wrapper when one is given.`

Where two functions differ in a way their signatures do not show, each block states how it differs
from the other. `attr` and `aria` both take `(container, name, attribute)` and both return
`string | undefined`. Only the doc comment tells a caller which form each one takes.

## Word choice

| Rejected                                                         | Written out                                                                  |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `@returns Empty when the component merges classNames correctly.` | `@returns Each violation, or an empty array when the component merges both.` |
| `@returns The value read extracted.`                             | `@returns The value the callback extracted from the element.`                |
| `whether the component crashed or simply produced nothing`       | `whether the component threw or rendered nothing`                            |
| `Two different defects.`                                         | `A component can fail this in two ways.`                                     |

The words `correctly`, `properly` and `as expected` claim the outcome instead of describing it. A
bare `Empty` never says what is empty. A `@returns` that names a parameter repeats the signature.
The word `simply` is a hedge. The word `crashed` is loose for `threw`. The last row is a fragment,
and every sentence takes a subject and a verb.

## Tags

Write a tag only where the signature leaves a question. Google states the rule for the two common
ones: `@param` and `@return` lines "are only required when they add information, and may otherwise
be omitted". The linter agrees. A function carrying neither tag passes clean.

No tag carries a type. TypeScript declares it already.

| Tag        | Write it                                                                       | Omit it                     |
| ---------- | ------------------------------------------------------------------------------ | --------------------------- |
| `@param`   | The name and type leave a question, such as a prefix the caller has to strip   | The name and type answer it |
| `@returns` | The type does not say what the value means, or a second branch returns nothing | The type says it            |
| `@throws`  | The body throws. The linter enforces this one                                  | Nothing in the body throws  |
| `@link`    | A reader would otherwise search for the identifier                             | Nothing requires it         |

`@param` and `@returns` text does not open with "What", "Whatever" or "Which", and does not repeat
the name of the thing it describes. `@throws` names the error type as a link, as in
`@throws {@link Error} When the file exists and cannot be read.`

The lint rule requires a `@param` tag on every parameter once one of them has one, in signature
order. Where only one parameter needs more than its type gives it, describe that parameter in the
paragraph instead of adding `@param` for the rest.

A wrapped description aligns at three spaces, on `@param` and on `@returns` alike. Write one space
and `vp check` reports a formatting error. `vp check --fix` then rewrites the line to three spaces
and the file passes, measured on `packages/vite-config/src/federation/host.ts`.

```ts
/**
 * @param options - Which optional parts to check, and how to reach a component
 *   that cannot render on its own.
 * @returns Each violation in the order the checks run, or an empty array for a
 *   component that conforms.
 */
```

A function that calls a throwing function throws as well. The linter never asks for the tag on the
caller. Add it where a function throws in a way its own signature hides. Where several functions in
a module share the same inherited throw, state it once in the module header. All four readers in
`dom.ts` throw when the part is absent, and four identical tags say that four times.

Document a parameter whose form its type does not show. `attr` indexes `dataset` and takes `state`,
while `aria` calls `getAttribute` and takes `aria-current`. A caller who passes `data-state` to
`attr` receives `undefined` and no error.

## The formatter

`vp check --fix` normalises a doc comment. Write these four forms and the fixer leaves the block
alone.

- A `@remarks` body indents three spaces.
- No blank line separates `@remarks` from the tag below it.
- The first word of a tag body is capitalised. Never open a tag body with a lowercase package name.
  `npm and bun accept an array of globs.` stands mid-paragraph and becomes `Npm` as the first word
  after `@remarks`.
- A one-line `/** ... */` is expanded to three lines. Write the three-line form.

## Module headers

Every file opens with a module header stating what the file is for. Only the package entry point
adds `@packageDocumentation`.

An entry point carries no `@remarks`. `jsdoc-js/sort-tags` requires `@packageDocumentation` first
and the formatter moves it last, so a block holding both tags fails one check or the other whichever
way it is written. Move the one fact the paragraph carried into the summary, or onto the constant it
describes. The order of `TAG_ORDER` in `packages/vite-config/src/lint/rules/docblock.ts:20` is the
cause, measured on 2026-09-16.

A specification file gets no doc comments at all, not even a module header. `lint.undocumented()` in
`packages/vite-config/src/lint/departure.ts:179` switches the rules off for `**/*.spec.ts` and
`**/*.fixtures.ts`, on the grounds that a specification is documented by its own test names.

A module header does not list the file's own exports. The `export` keywords already give a reader
that list, and any copy of it goes stale on the next export.

| Rejected                                                                                                                                                                         | Written out                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `violations is the module's one export. The remaining functions run one part of the check each and stay unexported because nothing outside this file composes them differently.` | `A check returns violations rather than a verdict, so one assertion reports which prop went missing rather than that false is not true.` |

## What never appears

- **The change.** `used to`, `no longer`, `now does` and `rather than X` belong in a changelog.
  Describe the thing as if it had always looked this way.
- **Status.** `no implementation yet`, `placeholder` and `when implemented` go stale without anybody
  touching them.
- **A link to a document.** A link points at an importable identifier that already exists.

## Comments inside a body

Write none. No `//` and no `{/* */}` inside a function, a recipe or a JSX tree. The reason goes in
the doc comment above the thing.

Two exceptions:

- An `eslint-disable-next-line <rule> -- <reason>` line is a directive. It must fit on one line,
  because a wrapped directive points at nothing.
- A known limitation is a single `// @todo` line in plain English, or a sentence in the doc comment.
  Marker comments such as `TODO:` are not used.
