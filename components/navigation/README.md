# @stealthscale/component-navigation

Draws the ways a person moves between places: the link, and the trail of crumbs from the front of a
site. Every component binds a recipe and draws nothing of its own, so a theme restyles all of them
by extending the recipe. The preset under `./theme` registers the recipes with an application's
compiler.

Every value a theme can change on a component is an axis of its recipe, so a caller sets it as a
prop and writes no style. A caller changes the element a component draws with `as`.

## Install

```bash
pnpm add @stealthscale/component-navigation
```

The package peers on `react` and `@stealthscale/theme`. An application lists the preset under
`./theme` among the presets its compiler installs.

## Link

Draws words a person follows to somewhere else. The ink, the visited ink, the cursor and the focus
ring come from the theme, so a theme decides what a link looks like once for every link.

```tsx
import { Link } from "@stealthscale/component-navigation";

<Link href="/invoices">Invoices</Link>;
<Link href="/terms" variant="underline">
  Terms
</Link>;
<Link as={RouterLink} to="/invoices">
  Invoices
</Link>;
```

| Axis      | Values               | Default |
| --------- | -------------------- | ------- |
| `variant` | `plain`, `underline` | `plain` |

Both looks underline under a pointer. The axis decides whether the underline is there at rest as
well. A link inside a paragraph is found by its underline as much as by its colour, so a reader who
cannot tell the two inks apart has nothing else to go on.

The element is `a` and takes an `href`. A link with no address is not a link to anything, and a
browser gives it no focus, no Enter and no offer to open elsewhere, so a control that acts rather
than navigates is a button. A router's own link goes in through `as`, which keeps the routing and
leaves the drawing here.

## Breadcrumb

Draws the path from the front of a site to the page a person is on, composed as `Breadcrumb.Root`
holding a list of crumbs.

```tsx
import { Breadcrumb } from "@stealthscale/component-navigation";

<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator>/</Breadcrumb.Separator>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/invoices">Invoices</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator>/</Breadcrumb.Separator>
    <Breadcrumb.Item>
      <Breadcrumb.CurrentLink>April</Breadcrumb.CurrentLink>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>;
```

| Axis      | Values                       | Default |
| --------- | ---------------------------- | ------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl` | `md`    |
| `variant` | `plain`, `underline`         | `plain` |

The size sets the text on the root and the gap on the list, so every part reads at one size by
inheriting it. It stops at `xl` because it reads the body role, a trail being read at the size of
the page around it rather than as a heading.

The last crumb is `Breadcrumb.CurrentLink` and not a link. It draws a `span` carrying
`aria-current="page"`, which is what tells a screen reader which crumb is where the reader is, and a
link to the page already open would be a control that does nothing. It is the one crumb at full
strength and the crumbs above it are muted, because the crumb naming where you are is the one worth
reading first.

The trail does four more things for accessibility:

- **The landmark is named.** The root is a `nav` carrying `aria-label="Breadcrumb"` by default,
  because a page usually holds more than one navigation landmark and an unnamed one is announced
  with nothing to tell it from the others. State your own to override it.
- **The list keeps its role.** The list is an `ol` stating `role="list"`, because a list drawn with
  no marker loses its role in Safari and a reader is then told neither how many crumbs there are nor
  which one they are on.
- **The separator is a row, not a crumb.** It sits between two items as a row of the list rather
  than inside one, so a screen reader counting the list counts the crumbs.
- **The separator is silent.** It carries `aria-hidden` and a presentation role, because the list
  already carries the order and a mark read out between every pair adds nothing.

The separator turns around where the line runs right to left, so a chevron pointing forwards keeps
pointing forwards.

## Licence

MIT. See [LICENSE](LICENSE).
