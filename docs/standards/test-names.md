# Test names

Write a test name as one sentence about behaviour. The enclosing `describe` names the subject. The
`it` states the predicate. Read together, they form the sentence.

```ts
import { describe, expect, it } from "vitest";

describe("compose", () => {
  it("appends every contribution in the order they were written", () => { … });
  it("throws when a removal names a contribution that is absent", () => { … });
});
```

Read the second case as "compose throws when a removal names a contribution that is absent". A name
that does not complete that sentence does not say what the test checks.

Put one `describe` in a file. Name the subject in it. Put every case beneath it as an `it`.
`vp check` reports a bare top-level `test`, a second `describe`, and a `describe` nested inside
another. Import the test functions from `vitest`. Do not import them from `vite-plus/test`. That
module only re-exports them.

## Converting an existing specification

Most specifications in this repository predate this standard. A converted file changes in four
places:

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

The import moves to `vitest`. `test` becomes `it`. A `describe` names the subject the file was
already about. Each title loses the clause after its comma. `vp lint --fix` performs the first two
changes. Do the other two by hand. Only you know what the file tests.

## State the action, the result, and the condition

Take the name `returns an empty array when the workspaces field is empty`:

| Part      | In the name                        |
| --------- | ---------------------------------- |
| Action    | returns                            |
| Result    | an empty array                     |
| Condition | when the workspaces field is empty |

A name without a condition describes the whole function instead of one case. A name without a result
says that a case exists and not what it proves.

Write the name in the third person. Open it on a verb. Do not open it with `should`. The verb reads
as a sentence without it. The docblock standard requires the same verb on every summary line.

| Bad                               | Good                             |
| --------------------------------- | -------------------------------- |
| `should return an empty array`    | `returns an empty array`         |
| `should throw if no key provided` | `throws when no key is provided` |
| `Will expose the response object` | `exposes the response object`    |

## One behaviour per name

A name containing "and" covers two behaviours. Write two tests.

Do not put a comma in a name. The clause after a comma states why the case exists. A name does not
state that.

| Bad                                                                              | Good                                   |
| -------------------------------------------------------------------------------- | -------------------------------------- |
| `marks each kind, so the pipeline can tell them apart`                           | `sets kind on every layer`             |
| `renames a layer built from another, so it carries the call the consumer wrote`  | `renames a layer derived from another` |
| `takes back a preset by name, which is the alternative to restating what it set` | `removes the preset the removal names` |

Put the reason a case is worth testing in the docblock of the thing under test. A runner prints
forty names in a column. A name long enough to hold a reason is unreadable there.

## Use the words the code uses

A reader sees a test name next to the identifier it tests. A name in words the code does not use
makes the reader translate every line.

| Bad                                                                     | Good                                                                       |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `answers an empty list where the field is neither a list nor an object` | `returns an empty array when workspaces is neither an array nor an object` |
| `drops an entry that is not a name, rather than handing it on`          | `drops an entry that is not a string`                                      |
| `asks a predicate, where it was given one`                              | `calls apply when it is a function`                                        |
| `takes part everywhere when it says nothing about where`                | `applies to every command when apply is absent`                            |
| `keeps what it was stated with`                                         | `keeps the options it was constructed with`                                |
| `refuses a removal naming nothing contributed above it`                 | `throws when the removal names a contribution that is absent`              |

The Bad column comes from specifications in this repository. It uses _answers_ for returns, _states_
for declares, _takes part_ for applies, and _a list_ for an array. The code under test uses none of
those words. The Good column uses the parameter name, the type name, and the condition.

Use the industry term in a name, the same as in code: `validate`, `resolve`, `dispose`, `registry`,
`pending`, `metadata`.

## Name the case, not the implementation

A name should still be correct after the implementation is rewritten. A name that quotes the current
algorithm is not.

| Bad                         | Good                                               |
| --------------------------- | -------------------------------------------------- |
| `uses a Map to deduplicate` | `returns each name once when the input repeats it` |
| `walks the list twice`      | `resolves a removal that names a layer above it`   |

## One case per branch

On any branch or fallback, name the cases it distinguishes. Write one `it` per case. Start with the
case the branch was added for.

Coverage counts executed lines, not considered cases. A fallback in this repository merged at 100%
coverage and broke CI. Every test had taken the other side of the branch.

Use `it.each` where the same logic runs over many inputs:

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

Do not use a table where a case needs a branch of its own. A branch inside the body means the cases
are not one test. Split them. Let each name state what it checks.

## Leave these out

- The word `test`. The runner has already said it.
- `correctly`, `properly`, and `as expected`. They claim the assertion instead of describing it.
- A count nobody can trace, such as `handles the 3 cases`.
- The issue number that prompted the case. It belongs in the commit message.
- A name for the kind of test rather than for the behaviour: `works`, `happy path`, `edge case`.
