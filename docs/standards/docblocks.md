# Doc comments

Write a doc comment on every function, on every arrow function assigned inside a function, on every
type, on every interface member, and on every module-level constant, exported or not.

```ts
/**
 * Resolves the workspace globs a manifest declares.
 *
 * @remarks
 *   The formats are read in order. The first one present supplies the answer. Undefined means the
 *   directory is not a workspace root. An empty array means it is a workspace root that declares
 *   no packages.
 * @param at - The directory holding the manifest.
 * @param manifest - The parsed package.json found at that directory.
 * @returns Each declared glob, or undefined outside a workspace root.
 * @throws {@link Error} When pnpm-workspace.yaml exists and cannot be read.
 */
```

`vp check` enforces the syntax, the coverage, and the tag vocabulary. This document covers what it
cannot see. The standard is TSDoc. The rule set is in
`packages/vite-config/src/lint/rules/docblock.ts`.

## The summary line

Open on a third-person verb. Write one complete sentence. Do not restate the identifier.

| Bad                                                                   | Good                                                                                |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `Whether a value satisfies a schema, narrowing it to the input type.` | `Returns true when the schema accepts the value, and narrows it to the input type.` |
| `Every refusal, in schema order.`                                     | `Lists every refusal in the order the schema reported them.`                        |
| `The schemes a link may use.`                                         | `Lists the schemes a link may use.`                                                 |
| `A widget frame with a grip and a control row.`                       | `Draws a widget frame holding a grip and a control row.`                            |
| `Reports why a component's render failed.`                            | `Reports whether a component rendered, and why it did not.`                         |

Write a sentence where a noun phrase would do. Reviewers in this repository reject the noun phrase
more often than any other fault. Cover every outcome the function reports. The last row shows a
summary that covered one branch of two.

## The paragraph

Write at most one short paragraph under `@remarks` after the summary. Put in it what the code cannot
show: a decision, a constraint, or a measured consequence. Give a prop one line, or none where its
name explains it.

Everything before the first tag is the summary. An index page lists only that summary. The detail
page shows the remarks below it. If you leave the paragraph untagged, the index listing shows the
whole block.

Name the actor in every sentence. A sentence whose subject you cannot point at has hidden it in a
noun. No tool reports this.

Reviewers accept these four failures because each one reads well.

**It restates what the name already implies.** A reader of `classNames` already knows the function
is about merging.

| Bad                                                                                                | Good                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `A conforming component merges a caller's className into its own rather than dropping either one.` | `A component can fail this in two ways. One that never reads the prop drops the caller's class. One that reads it and assigns it drops its own. The second looks correct at the call site.` |

**It lists the functions the body calls.** A reader gets that list from the body. The paragraph goes
stale on the next check somebody adds.

| Bad                                                                                                                                                                                | Good                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Lists every way a component fails: rendering without throwing, merging a className, forwarding a ref and unknown props, and whichever of children or asChild the options enable.` | `The first check establishes that there is an element to read at all. When it fails, the result contains that one entry and nothing else, because no later check can run without an element.` |

**It describes the mechanism instead of the guarantee.** A caller acts on the guarantee. The body
shows the mechanism.

| Bad                                                                                                                  | Good                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `The unmount happens in a finally block, so a read that throws still leaves the container clean for the next check.` | `The component is unmounted even when read throws, so one check never reads the element another check rendered.` |

**It repeats a block that already exists.** A paragraph on `drawn` describing `options.wrapper` says
what the `wrapper` member's own doc comment says. Move the condition into the summary and delete the
paragraph. The block then reads `Renders a component, inside options.wrapper when one is given.`

Where two functions differ in a way their signatures do not show, state in each block how it differs
from the other. `attr` and `aria` both take `(container, name, attribute)` and both return
`string | undefined`. Only the doc comment tells a caller which form each one takes.

## Word choice

| Bad                                                              | Good                                                                         |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `@returns Empty when the component merges classNames correctly.` | `@returns Each violation, or an empty array when the component merges both.` |
| `@returns The value read extracted.`                             | `@returns The value the callback extracted from the element.`                |
| `whether the component crashed or simply produced nothing`       | `whether the component threw or rendered nothing`                            |
| `Two different defects.`                                         | `A component can fail this in two ways.`                                     |

`correctly`, `properly`, and `as expected` claim the outcome instead of describing it. A bare
`Empty` does not say what is empty. A `@returns` that repeats a parameter name repeats the
signature. `simply` is a hedge. `crashed` is loose for `threw`. The last row is a fragment. Every
sentence takes a subject and a verb.

## Tags

Write a tag only where the signature leaves a question. Google states the rule for the two common
ones: `@param` and `@return` lines "are only required when they add information, and may otherwise
be omitted". The linter applies the same rule. A function with neither tag passes.

Do not write a type in a tag. TypeScript declares it already.

| Tag        | Write it                                                                       | Omit it                     |
| ---------- | ------------------------------------------------------------------------------ | --------------------------- |
| `@param`   | The name and type leave a question, such as a prefix the caller has to strip   | The name and type answer it |
| `@returns` | The type does not say what the value means, or a second branch returns nothing | The type says it            |
| `@throws`  | The body throws. The linter enforces this one                                  | Nothing in the body throws  |
| `@link`    | A reader would otherwise search for the identifier                             | Nothing requires it         |

Do not open `@param` or `@returns` text with "What", "Whatever", or "Which". Do not repeat the name
of the thing it describes. Write the error type in `@throws` as a link:
`@throws {@link Error} When the file exists and cannot be read.`

Once one parameter has a `@param` tag, the lint rule requires one on every parameter, in signature
order. Where only one parameter needs more than its type gives it, describe that parameter in the
paragraph instead of adding `@param` for the rest.

Align a wrapped description at three spaces, on `@param` and on `@returns` alike. One space is a
formatting error in `vp check`. `vp check --fix` rewrites the line to three spaces and the file
passes. Measured on `packages/vite-config/src/federation/host.ts`.

```ts
/**
 * @param options - Which optional parts to check, and how to reach a component
 *   that cannot render on its own.
 * @returns Each violation in the order the checks run, or an empty array for a
 *   component that conforms.
 */
```

A function that calls a throwing function throws as well. The lint rule does not require the tag on
the caller. Add it where a function throws in a way its own signature hides. Where more than one
function in a module shares the same inherited throw, state it once in the module header. All four
readers in `dom.ts` throw when the part is absent. A tag on each one says that four times.

Document a parameter whose form its type does not show. `attr` indexes `dataset` and takes `state`.
`aria` calls `getAttribute` and takes `aria-current`. A caller who passes `data-state` to `attr`
receives `undefined` and no error.

## The formatter

`vp check --fix` normalises a doc comment. Write these four forms and the fixer leaves the block
alone.

- Indent a `@remarks` body three spaces.
- Do not put a blank line between `@remarks` and the tag below it.
- Capitalise the first word of a tag body. Do not open a tag body with a lowercase package name.
  `npm and bun accept an array of globs.` stands mid-paragraph. As the first sentence after
  `@remarks` it becomes `Npm`.
- Write a doc comment on three lines. The fixer expands a one-line `/** ... */` to three.

## Module headers

Open every file with a module header that states what the file is for. Add `@packageDocumentation`
only in the package entry point.

Do not write `@remarks` in an entry point. `jsdoc-js/sort-tags` requires `@packageDocumentation`
first and the formatter moves it last. A block with both tags fails one check or the other,
whichever order it uses. Move the fact from the paragraph into the summary, or onto the constant it
describes. The order of `TAG_ORDER` in `packages/vite-config/src/lint/rules/docblock.ts:20` is the
cause. Measured on 2026-09-16.

Skip doc comments in a specification file, including the module header. `lint.undocumented()` in
`packages/vite-config/src/lint/departure.ts:179` switches the rules off for `**/*.spec.ts` and
`**/*.fixtures.ts`. Its test names document a specification.

Do not list the file's own exports in a module header. The `export` keywords already give a reader
that list. Any copy goes stale on the next export.

| Bad                                                                                                                                                                              | Good                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `violations is the module's one export. The remaining functions run one part of the check each and stay unexported because nothing outside this file composes them differently.` | `A check returns violations rather than a verdict, so one assertion reports which prop went missing rather than that false is not true.` |

## Leave these out

- **The change.** `used to`, `no longer`, `now does`, and `rather than X` belong in a changelog.
  Describe the thing as if it had always looked this way.
- **Status.** `no implementation yet`, `placeholder`, and `when implemented` go stale without
  anybody touching them.
- **A link to a document.** Link only to an importable identifier that already exists.

## Comments inside a body

Write none. No `//` and no `{/* */}` inside a function, a recipe, or a JSX tree. Put the reason in
the doc comment above the thing.

The exceptions:

- An `eslint-disable-next-line <rule> -- <reason>` line is a directive. Write it on one line. A
  wrapped directive points at nothing.
- Record a known limitation as one `// @todo` line, or as a sentence in the doc comment. Do not
  write `TODO:` markers.
