# @stealthscale/component-a11y

Draws what a keyboard and a screen reader need, and an eye does not: words read out and drawn
nowhere, a way past the navigation, and one tab stop over a set of controls. Every component binds a
recipe and draws nothing of its own, so a theme moves all of them by extending the recipe. The
preset under `./theme` registers the recipes with an application's compiler.

## Install

```bash
pnpm add @stealthscale/component-a11y
```

The package peers on `react`, `@stealthscale/hooks` and `@stealthscale/theme`. An application lists
the preset under `./theme` among the presets its compiler installs.

## VisuallyHidden

Reads its words to a screen reader and draws them nowhere. The words stay in the accessibility tree,
which `display: none` and `visibility: hidden` both take them out of. A control a keyboard can reach
is `focusable`, so it comes into view while focus is on it and a sighted reader tabbing through the
page keeps their place.

```tsx
import { VisuallyHidden } from "@stealthscale/component-a11y";

<button type="button">
  <Icon viewBox="0 0 24 24">…</Icon>
  <VisuallyHidden>Close</VisuallyHidden>
</button>;
<VisuallyHidden as="h2">Sections</VisuallyHidden>;
```

| Axis        | Values | Default |
| ----------- | ------ | ------- |
| `focusable` | `true` | off     |

## SkipNav

Carries a keyboard past the navigation, composed as `SkipNav.Link` at the top of the document and
`SkipNav.Target` where the content starts. The link is hidden until focus reaches it, so a reader
who tabs meets it first and a reader who never tabs never sees it. The target takes a tab index of
minus one, because a browser moves focus to a fragment only where the target can hold focus.

```tsx
import { SkipNav } from "@stealthscale/component-a11y";

<SkipNav.Link>Skip to content</SkipNav.Link>;
<SkipNav.Target as="main">…</SkipNav.Target>;
```

The link points at `#content` and the target answers to it, so neither states the other. A page with
more than one landing place names its own: `<SkipNav.Link href="#search">` beside
`<SkipNav.Target id="search">`.

## RovingFocus

Holds one tab stop for a set of controls, composed as `RovingFocus.Root` holding `RovingFocus.Item`.
A reader reaches the set with Tab and moves inside it with the arrows, which is what the toolbar,
tablist and menubar patterns ask for. Home and End go to the ends, a disabled item is passed over,
and the arrows run the other way where the line runs right to left.

```tsx
import { RovingFocus } from "@stealthscale/component-a11y";
import { Button } from "@stealthscale/component-actions";

<RovingFocus.Root role="toolbar">
  <RovingFocus.Item as={Button} variant="ghost">
    Cut
  </RovingFocus.Item>
  <RovingFocus.Item as={Button} variant="ghost">
    Copy
  </RovingFocus.Item>
</RovingFocus.Root>;
```

The root carries no role of its own, because what a set of controls is called is the caller's. It
tells a screen reader which way the set runs only where the caller gave it a role, since
`aria-orientation` means nothing on a plain element.

| Axis          | Values                           | Default      |
| ------------- | -------------------------------- | ------------ |
| `orientation` | `horizontal`, `vertical`, `both` | `horizontal` |

`wrap` joins the ends up, `activeId` drives which item holds the stop from outside, and
`onActiveIdChange` reports it moving.

## Licence

MIT. See [LICENSE](LICENSE).
