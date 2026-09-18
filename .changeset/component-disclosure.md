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

The package is the first to take runtime dependencies. It installs the machine, the React adapter
and the types the adapter's own signatures reach, all pinned together through the workspace catalog,
because the machines share a core and a core at two versions breaks them.
