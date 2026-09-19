---
"@stealthscale/component-collections": patch
"@stealthscale/component-content": patch
"@stealthscale/component-data": patch
"@stealthscale/component-disclosure": patch
"@stealthscale/component-feedback": patch
"@stealthscale/component-forms": patch
"@stealthscale/component-modals": patch
"@stealthscale/component-navigation": patch
"@stealthscale/component-screen": patch
"@stealthscale/component-surfaces": patch
---

components: hold every package to the barrel rule its ADR already states

- ADR-0018 puts a specification beside every source file, the barrels included, and records that the
  conformance suite holds a package to it "where the package asks with `barrels: true`, which every
  component package does". Ten of the sixteen asked for nothing, so the rule was written down and
  enforced nowhere in them.
- `collections`, `content`, `data`, `disclosure`, `feedback`, `forms`, `modals`, `navigation`,
  `screen` and `surfaces` now ask. The check reported thirteen barrels with no specification beside
  them, each now written: the package barrel of nine of those ten, `screen`'s folding and focus
  barrels, and `collections`' collection barrel.
- A barrel specification names every export as a sorted list and asserts that neither a recipe nor a
  binding is among them, which is what catches a leaked binding and a dropped export.
- Forty-three barrels under `foundations/` and `packages/` still have no specification. The ADR's
  decision covers them and its enforcement note does not, so they are left for a pass of their own.
