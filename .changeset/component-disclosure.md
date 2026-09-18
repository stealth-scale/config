---
"@stealthscale/component-disclosure": minor
---

component-disclosure: publish the collapsible

- `Collapsible` shows and hides the block beneath a control, composed as `Collapsible.Root` holding
  a trigger, the block and the mark that turns as it opens. It binds Zag's collapsible machine
  directly, connected once at the root, so every part reads one api from one running machine.
- The size steps the trigger, the block and the mark together at one name, and the trigger reads the
  control scale so a collapsible lines up with a button of the same name beside it. Four looks frame
  the pair and three decide how the block appears and goes, each reading an animation style the
  theme owns.
- The machine writes the accessibility. The control carries `aria-expanded` and points at the block
  with `aria-controls`, a closed block is out of the tab order and the accessibility tree, and the
  mark is kept out of it because the control already says whether the block is expanded.
- The root takes the machine's own settings beside the recipe's axes: `open`, `defaultOpen`,
  `onOpenChange`, `disabled`, `collapsedHeight`, `onExitComplete`, `id` and `dir`. It takes no
  element id or direction, because the machine states both and builds every ARIA reference from the
  id.
- `collapsedHeight` leaves a strip of the block showing while it is closed, which turns a disclosure
  into a preview.
- The mark holds still for a reader who asked for less motion, and a block that starts open does not
  animate in.
- `Tabs` shows one panel at a time, chosen from a strip of controls, composed as `Tabs.Root` holding
  a list and a panel for each. Each control names the panel it shows with `value` and each panel
  names its control the same way, which is the only pairing the machine cannot work out.
- Four looks draw the strip and one size steps the controls and the panels together. Which way the
  set runs is not an axis: the machine states it and writes it onto every part, and the recipe reads
  that, so the strip turns into a column and the bar moves to its inline edge without anyone saying
  it twice.
- The strip is one tab stop. Only the control in force is reachable by Tab, the arrows move between
  them, and a panel holding nothing focusable takes a tab stop of its own so tabbing out of the
  strip moves to what was just chosen.
- The bar marking the control in force is positioned from measurements the machine takes, so the
  recipe states its thickness and its colour and never its place.

The package is the first to take runtime dependencies. It installs the machine, the React adapter
and the types the adapter's own signatures reach, all pinned together through the workspace catalog,
because the machines share a core and a core at two versions breaks them.
