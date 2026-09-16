# Doc comments

Write a doc comment on every function, on every arrow function assigned inside a function, on every
type, and on every interface member.

```ts
/**
 * Resolves the workspace globs a manifest declares.
 *
 * npm, bun and yarn each state the list under `workspaces`, and pnpm states it in a file beside
 * the manifest. An entry that is not a string is dropped rather than passed on.
 *
 * @param manifest - The parsed manifest to read.
 * @returns The globs in the order the manifest declared them, or `undefined` when the manifest
 * omits the `workspaces` field.
 */
```

`vp check` enforces the syntax, the coverage and the tag vocabulary, so this document covers what it
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

A noun phrase standing where a sentence belongs is the failure this repository has rejected most
often.

## The paragraph

The summary is followed by at most one short paragraph, and it carries what the code cannot show: a
decision, a constraint, or a measured consequence. A prop gets one line, or none where its name is
self-explanatory.

Describe the contract rather than the implementation. State an asymptotic bound only where a caller
cannot discover it from the signature.

## Tags

No tag carries a type, because TypeScript declares it already. A `@param` that repeats the
parameter's name says nothing, so omit it. Write `@throws` for every error a caller can receive,
since a thrown error appears nowhere in the signature.

`@param` and `@returns` text does not open with "What", "Whatever" or "Which", and does not repeat
the name of the thing it describes.

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
