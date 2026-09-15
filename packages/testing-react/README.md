# @stealthscale/testing-react

A kit, meaning a dev-time library another repository takes.

Reads a rendered component in a specification, through the `data-part` marking each piece of its
anatomy and the `data-` attributes carrying its state.

It is a package of its own rather than an entry of `@stealthscale/testing`, because that one reads a
workspace off the disk and a specification doing that should not have the document and the JSX
runtime in scope to do it. One package compiles under one tsconfig, so the two surfaces are two
packages.

```bash
pnpm add -D @stealthscale/testing-react
```

## Why these handles

A component reports what it is doing on `data-` attributes: `data-part="content"`,
`data-state="open"`, `data-shape="circle"`. A restyling leaves those alone. A class name changes
with the recipe, the text changes with the copy, and the shape of the tree changes whenever the
library underneath is upgraded — so a specification reaching through any of the three fails on a
change that broke nothing.

## Reading

```ts
import { attr, only, part, parts, renderedAs, violations } from "@stealthscale/testing-react";

const { container } = render(<Cropper cropShape="circle" />);

attr(container, "root", "shape"); // "circle"
renderedAs(container, "title"); // "H2"
parts(container, "handle").length; // 8
only(container); // the one element the render produced
violations(Cropper); // [] where it keeps the component contract
```

| Export       | Answers                                       |
| ------------ | --------------------------------------------- |
| `part`       | The one element carrying a named part         |
| `parts`      | Every element carrying it, as a list          |
| `only`       | The single element a render produced          |
| `attr`       | A `data-` attribute off a named part          |
| `renderedAs` | The tag name a part rendered as               |
| `violations` | The parts of the component contract it breaks |

## The component contract

A component in a design system is not only its own markup. A consumer puts a `className` on it,
holds a `ref` to it, spreads an attribute onto it, and expects every one of those to reach the
element that was rendered. None of it is what the component is for, all of it is what makes the
component usable from the outside, and each is dropped the same way: by binding a recipe to an
element and spreading nothing.

`violations` mounts the component once per check and answers what it breaks:

```ts
import { violations } from "@stealthscale/testing-react";

it("keeps the component contract", () => {
  expect(violations(Box, { children: true, element: "DIV" })).toStrictEqual([]);
});
```

| Checked                             | Always | Reported as                                     |
| ----------------------------------- | ------ | ----------------------------------------------- |
| renders an element at all           | yes    | `renders no element`                            |
| does not throw rendering it         | yes    | `throws when it renders: <message>`             |
| merges the caller's `className`     | yes    | `does not merge className`                      |
| keeps its own `className` beside it | yes    | `replaces its own className instead of merging` |
| forwards `ref` to what it rendered  | yes    | `does not forward ref`                          |
| spreads props it does not name      | yes    | `does not spread unknown props`                 |
| renders the tag `element` names     | no     | `renders DIV, not SPAN`                         |
| renders `children`                  | no     | `does not render children`                      |
| honours `asChild`                   | no     | `does not honour asChild`                       |

The last three are options because they are not every component's to keep: the element a box renders
is the caller's business, a rule and a spacer take no children, and a component that renders its own
element owes nothing about `asChild`. `props` passes whatever the component needs before it renders
at all — a ratio, a label, a value.

A component that throws, or that renders no element to check, fails the first check and is asked no
others, since every answer after it would be the same failure restated. The two are reported apart
because they are different bugs.

## A part that cannot be rendered alone

A compound's part reads its state from a provider and throws without one, so checking it needs both
the provider around it and a way to find it inside what that provider rendered:

```tsx
violations(CardHeader, {
  element: "DIV",
  subject: (container) => part(container, "header"),
  wrapper: (children) => <CardRoot>{children}</CardRoot>,
});
```

`wrapper` is whatever the component needs above it — a provider, a theme, a router. `subject` finds
the element under test, and defaults to `only`, which is right for a component rendered on its own
and wrong under a wrapper, where the first element belongs to the wrapper.

Violations rather than a verdict, the way an audit is: a specification writes one assertion, and a
failure names the prop that went missing rather than saying that `false` is not `true`. Nothing here
asserts, so the package stays free of a test runner.

## A missing part throws

Every reader throws where the part it was asked for is absent, naming it:

```
Nothing in the rendered output carries [data-part="trigger"].
```

That is what lets a specification write the read inline, with no guard at the call site and no
non-null assertion, which the house linter refuses. It also decides what a failure says: which part
went missing, rather than that `undefined` is not `"open"`.

`parts` is the exception, since a component drawing none of something is a thing a specification
asserts. It answers an empty list.

## Licence

MIT
