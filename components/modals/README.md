# @stealthscale/component-modals

Draws what the page waits for: a dialog, a drawer, a palette, a tour. Every component binds a recipe
and draws nothing of its own, so a theme restyles all of them by extending the recipe. The preset
under `./theme` registers the recipes with an application's compiler.

## Install

```bash
pnpm add @stealthscale/component-modals
```

The package peers on `react`, `@stealthscale/theme` and `@stealthscale/component-collections`. An
application lists the preset under `./theme` among the presets its compiler installs.

Every value a theme can change on a component is an axis of its recipe, so a caller sets it as a
prop and writes no style. A caller changes the element a component draws with `as`.

## Command

Draws the palette a person opens with a keystroke, types into, and runs one thing from. Composed as
`Command.Root` holding a field and the list it narrows.

```tsx
import { Command } from "@stealthscale/component-modals";

<Command.Root actions={actions} aria-label="Commands" onRun={run}>
  <Command.Input placeholder="Type a command" />
  <Command.List />
  <Command.Empty>No command matches</Command.Empty>
</Command.Root>;
```

| Axis   | Values           | Default |
| ------ | ---------------- | ------- |
| `size` | `sm`, `md`, `lg` | `md`    |

Actions go in as data rather than as children, because the palette reorders and drops them on every
keystroke and children would put the caller in charge of that. One action states this:

| Member     | What it is                                                              |
| ---------- | ----------------------------------------------------------------------- |
| `label`    | The words a reader types towards and a screen reader reads out          |
| `value`    | What `onRun` is handed when the action is chosen                        |
| `group`    | The heading it is listed under                                          |
| `icon`     | A mark drawn before the words                                           |
| `keywords` | Words that should find it beyond its own, so `add` finds `New document` |
| `shortcut` | The keystroke that runs it without the palette                          |
| `disabled` | Whether it is listed but cannot be run                                  |

The field keeps focus and the list never takes it. The field carries `aria-activedescendant`, so a
screen reader announces the row the arrow keys are on while the caret stays where the reader is
typing. `count` says how many matches are left after each keystroke, announced politely, so a reader
who cannot see the list still knows whether they have narrowed it to one.

Type `jose` and the palette finds `José`. Matching folds case and accents, and reads `keywords`
beside `label`. Headings keep the order their first action was written in. A caller decides what a
reader sees first by the order they write.
