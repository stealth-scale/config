# Test names

A test name is a statement about behaviour. The enclosing `describe` names the subject, the `it`
states the predicate, and the two read together as one sentence.

```ts
import { describe, expect, it } from "vitest";

describe("compose", () => {
  it("appends every contribution in the order they were written", () => { … });
  it("throws when a removal names a contribution that is absent", () => { … });
});
```

Read the second case as "compose throws when a removal names a contribution that is absent". A name
that does not complete that sentence does not say what the test checks.

A file holds one `describe` naming the subject, with every case beneath it as an `it`. `vp check`
reports a bare top-level `test`, a second `describe`, and a `describe` nested inside another. Import
the test functions from `vitest`, never from `vite-plus/test`, which only re-exports them.

## The shape, before and after

Most specifications in this repository predate the standard and are being converted. A converted
file changes in four places at once, which is easier to read than to describe:

```ts
// Before
import { expect, test } from "vite-plus/test";

test("marks each kind, so the pipeline can tell them apart", () => { … });
test("takes part everywhere when it says nothing about where", () => { … });

// After
import { describe, expect, it } from "vitest";

describe("layer", () => {
  it("sets kind on every layer", () => { … });
  it("applies to every command when apply is absent", () => { … });
});
```

The import moves to `vitest`, `test` becomes `it`, a `describe` names the subject the file was
already about, and each title loses the clause after its comma. `vp lint --fix` performs the first
two. The other two are yours, because only you know what the file is testing.

## A name states the action, the condition and the result

| Part      | In the example above               |
| --------- | ---------------------------------- |
| Action    | returns                            |
| Result    | an empty array                     |
| Condition | when the workspaces field is empty |

A name without a condition describes the function rather than a case. A name without a result says
that a case exists and does not say what it proves.

Write the name in the third person and open it on a verb. Do not open it with `should`: the verb
reads as a sentence without it, and the docblock standard already asks for that verb on every
summary line.

| Rejected                          | Written out                      |
| --------------------------------- | -------------------------------- |
| `should return an empty array`    | `returns an empty array`         |
| `should throw if no key provided` | `throws when no key is provided` |
| `Will expose the response object` | `exposes the response object`    |

## One behaviour per name

A name containing "and" covers two behaviours, and two behaviours are two tests.

A comma fails for a second reason. The clause after it is the reason the case exists, and a name
does not state that reason.

| Rejected                                                                         | Written out                            |
| -------------------------------------------------------------------------------- | -------------------------------------- |
| `marks each kind, so the pipeline can tell them apart`                           | `sets kind on every layer`             |
| `renames a layer built from another, so it carries the call the consumer wrote`  | `renames a layer derived from another` |
| `takes back a preset by name, which is the alternative to restating what it set` | `removes the preset the removal names` |

The docblock of the thing under test states why a case is worth testing. A runner prints forty names
in a column, and a name long enough to hold a reason is unreadable there.

## Use the vocabulary of the code

A reader sees a test name next to the identifier it tests. A vocabulary invented for the document
forces that reader to translate every line.

| Rejected                                                                | Written out                                                                |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `answers an empty list where the field is neither a list nor an object` | `returns an empty array when workspaces is neither an array nor an object` |
| `drops an entry that is not a name, rather than handing it on`          | `drops an entry that is not a string`                                      |
| `asks a predicate, where it was given one`                              | `calls apply when it is a function`                                        |
| `takes part everywhere when it says nothing about where`                | `applies to every command when apply is absent`                            |
| `keeps what it was stated with`                                         | `keeps the options it was constructed with`                                |
| `refuses a removal naming nothing contributed above it`                 | `throws when the removal names a contribution that is absent`              |

The left column comes from specs in this repository. Each name writes _answers_ for returns,
_states_ for declares, _takes part_ for applies and _a list_ for an array. None of those words
appears in the code under test. The right column names the parameter, the type and the condition.

Use the industry term in a name, the same as in code: `validate`, `resolve`, `dispose`, `registry`,
`pending`, `metadata`.

## Name the case, not the implementation

A name is still correct after the implementation is rewritten, unless it quotes the current
algorithm.

| Rejected                    | Written out                                        |
| --------------------------- | -------------------------------------------------- |
| `uses a Map to deduplicate` | `returns each name once when the input repeats it` |
| `walks the list twice`      | `resolves a removal that names a layer above it`   |

## One case per branch

Coverage counts executed lines rather than considered cases. A fallback merged at 100% coverage and
broke CI, because every test took the other side of the branch.

On any branch or fallback, name the cases it distinguishes and write one `it` per case. Start with
the case the branch was added for.

Where the same logic runs over many inputs, `it.each` keeps the sentence intact:

```ts
describe("parseHeader", () => {
  it.each([
    { give: "feat: add a thing", want: { scope: undefined, type: "feat" } },
    { give: "fix(css): drop the shim", want: { scope: "css", type: "fix" } },
  ])("parses $give", ({ give, want }) => {
    expect(parseHeader(give)).toMatchObject(want);
  });
});
```

A table is wrong wherever a subtest needs a branch of its own. A branch inside the body means the
cases are not one test, so split them and let each name state what it checks.

## What never appears

- The word `test`, which the runner has already said.
- `correctly`, `properly` and `as expected`, which claim the assertion instead of describing it.
- A count nobody can trace, such as `handles the 3 cases`.
- The issue number that prompted the case, which belongs in the commit message.
- A name for the shape of the test rather than for the behaviour: `works`, `happy path`,
  `edge case`.
