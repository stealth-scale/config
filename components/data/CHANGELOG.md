# @stealthscale/component-data

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`9079091`](https://github.com/stealth-scale/config/commit/9079091cf23b5f22dcbeab2d321538830e7f67a5) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-data: publish the badge
  
  - `Badge` labels something with one short word or a count, set off from what it labels. It takes a
    look, a size, a status and a corner, each an axis of its recipe, and `BadgePropsProvider` sets
    them for every badge below it.
  - Each look writes a background and an ink and nothing a pointer changes. A badge inside a row that
    hovers is crossed by the pointer whenever the row is, and one drawn in a fill would repaint there,
    which reads as a control a reader can press and then cannot.
  - The sizes read the semantic tag scale, so a badge is half the height of the control of its own
    size and its inset, its gap and its label come one step down. A medium badge beside a medium
    button reads at the small label.
  - The element is `span` and carries no role, so a screen reader reads its text and nothing else. A
    badge whose meaning is in its colour states that meaning with `aria-label`.

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
