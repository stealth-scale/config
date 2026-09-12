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
import { attr, only, part, parts, renderedAs } from "@stealthscale/testing-react";

const { container } = render(<Cropper cropShape="circle" />);

attr(container, "root", "shape"); // "circle"
renderedAs(container, "title"); // "H2"
parts(container, "handle").length; // 8
only(container); // the one element the render produced
```

| Export       | Answers                               |
| ------------ | ------------------------------------- |
| `part`       | The one element carrying a named part |
| `parts`      | Every element carrying it, as a list  |
| `only`       | The single element a render produced  |
| `attr`       | A `data-` attribute off a named part  |
| `renderedAs` | The tag name a part rendered as       |

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
