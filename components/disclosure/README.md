# @stealthscale/component-disclosure

Draws what is shown and hidden on the reader's say-so. Every component binds a recipe and draws
nothing of its own, so a theme moves all of them by extending the recipe. The preset under `./theme`
registers the recipes with an application's compiler.

Every value a theme can move on a component is an axis of its recipe, so a caller reaches it as a
prop and writes no style. A caller changes the element a component draws with `as`.

## Install

```bash
pnpm add @stealthscale/component-disclosure
```

The package peers on `react`, `@stealthscale/hooks` and `@stealthscale/theme`, and installs the
state machines it draws from. An application lists the preset under `./theme` among the presets its
compiler installs.

## Collapsible

Shows and hides the block beneath a control, composed as `Collapsible.Root` holding a trigger and
the block.

```tsx
import { Collapsible } from "@stealthscale/component-disclosure";

<Collapsible.Root variant="outline">
  <Collapsible.Trigger>
    Delivery details
    <Collapsible.Indicator>
      <ChevronIcon />
    </Collapsible.Indicator>
  </Collapsible.Trigger>
  <Collapsible.Content>Arrives Thursday.</Collapsible.Content>
</Collapsible.Root>;
```

| Axis      | Values                                            | Default |
| --------- | ------------------------------------------------- | ------- |
| `variant` | `plain`, `outline`, `subtle`, `surface`           | `plain` |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`    |
| `motion`  | `slide`, `fade`, `none`                           | `slide` |

The size steps the trigger, the block and the mark together at one name. The trigger reads the
control scale, so a collapsible lines up with a button of the same name beside it.

### The machine's settings

Beside the axes, the root takes the settings the machine reads. None of them is a style.

| Setting               | What it does                                           |
| --------------------- | ------------------------------------------------------ |
| `open`, `defaultOpen` | Drives it from outside, or sets where it starts        |
| `onOpenChange`        | Hears each time it opens or closes                     |
| `disabled`            | Stops the control opening it                           |
| `collapsedHeight`     | Leaves a strip of the block showing while it is closed |
| `onExitComplete`      | Fires once the closing animation has finished          |
| `id`                  | Names the machine, which builds its ARIA references    |
| `dir`                 | Says which way the line runs                           |

`collapsedHeight` is what turns a disclosure into a preview. The block keeps the height you name
while closed, so a reader still sees the first line or two and the control reveals the rest.

```tsx
<Collapsible.Root collapsedHeight="3lh" defaultOpen={false}>
```

Name an `id` where you want a stable one, in a test or where the markup is rendered on a server.
Pass it to the root rather than to an element, because the machine builds the reference between the
control and the block from it. The root takes no element `id` or `dir` for that reason.

### The accessibility the machine writes

None of this is a prop you can forget, because the machine writes all of it:

- **The control says what it does.** It carries `aria-expanded` and points at the block with
  `aria-controls`.
- **A closed block is out of reach.** It is hidden from a screen reader and from the tab order, so a
  keyboard passes over any control inside one.
- **The mark says nothing.** The control already says whether the block is expanded, so the
  indicator is kept out of the accessibility tree and turns on the state alone.

The mark turns half a revolution as the block opens, and holds still for a reader who asked for less
motion. Both motions read animation styles the theme owns, so a theme decides the pace and the
reduced-motion answer once for everything.

A block that starts open does not animate in. The machine holds its state attribute back on the
first render for exactly that reason, and writes it from the first animation frame onwards.

## Licence

MIT. See [LICENSE](LICENSE).
