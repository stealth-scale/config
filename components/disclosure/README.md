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

## Tabs

Shows one panel at a time, chosen from a strip of controls, composed as `Tabs.Root` holding a list
and a panel for each control.

```tsx
import { Tabs } from "@stealthscale/component-disclosure";

<Tabs.Root defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="overview">What the account holds.</Tabs.Content>
  <Tabs.Content value="activity">What has happened lately.</Tabs.Content>
</Tabs.Root>;
```

| Axis      | Values                                            | Default |
| --------- | ------------------------------------------------- | ------- |
| `variant` | `line`, `enclosed`, `subtle`, `plain`             | `line`  |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`    |

Each control names the panel it shows with `value`, and each panel names its control the same way.
Nothing else here is yours to state, because the machine works the rest out for itself.

Which way the set runs is not an axis. The machine states it, writes it onto every part, and the
recipe reads it, so the strip turns into a column and the bar moves to its inline edge without
anyone saying it twice.

### The machine's settings

| Setting                 | What it does                                            |
| ----------------------- | ------------------------------------------------------- |
| `value`, `defaultValue` | Drives it from outside, or sets which panel opens first |
| `onValueChange`         | Hears each time the panel changes                       |
| `orientation`           | Runs the strip across or down                           |
| `activationMode`        | Chooses a panel on focus, or only on a press            |
| `loopFocus`             | Joins the ends of the strip up                          |
| `deselectable`          | Lets a person close the panel they are on               |
| `id`                    | Names the machine, which builds its ARIA references     |

`activationMode` is worth knowing. It chooses on focus by default, so an arrow key both moves and
selects. A set whose panels are expensive to draw sets it to `manual`, and then an arrow moves the
focus and a press chooses.

### The accessibility the machine writes

- **The strip is one set.** It carries the tablist role and says which way it runs, so a screen
  reader announces the count and the arrows move inside it.
- **The strip is one tab stop.** Only the control in force is reachable by Tab, and the arrows move
  between them, so a person tabbing through a page steps over the set rather than through it.
- **Each panel is reachable.** A panel holding nothing focusable takes a tab stop of its own, so
  tabbing out of the strip moves to what was just chosen rather than past it.
- **A panel nobody chose is gone.** It is out of the tab order and out of the accessibility tree.

The bar that marks the control in force is positioned from measurements the machine takes, so the
recipe states its thickness and its colour and never its place. It is hidden until there is
something to measure, which keeps it from appearing at the start of the strip on the first render.

## Licence

MIT. See [LICENSE](LICENSE).
