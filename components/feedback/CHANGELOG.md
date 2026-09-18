# @stealthscale/component-feedback

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`8041d27`](https://github.com/stealth-scale/config/commit/8041d27526629165ca78a37751f77ec66ac4ec3c) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-feedback: publish the skeleton and the empty state
  
  - `Skeleton` stands in for content that has not arrived. It wraps that content rather than replacing
    it, so the stand-in comes out the size of the thing it stands in for without anybody stating a
    width, and it hides everything inside it until the content fades in. It takes a motion and a
    corner, each an axis of its recipe.
  - Every motion reads an animation style the theme states, so a reader who asked for reduced motion
    is served once in the theme rather than in every recipe.
  - `SkeletonText` stands in for a paragraph. A bar is one line tall and the space between two is half
    a line, both read off the line the bars stand in for, so a paragraph of stand-ins occupies what
    the real paragraph will and the page does not jump. The last bar of several is short.
  - `EmptyState` draws the panel a page shows where there is nothing to show, composed as
    `EmptyState.Root` holding a mark, a heading and a line saying what would be here. One size axis
    moves the room inside the panel, the gap in the content, the box of the mark and the size of the
    title together.
  - Neither the skeleton nor the panel carries a role. A page states `aria-busy` on whatever is
    waiting, which is one announcement rather than one per bar, and a page of empty panels is not a
    page of landmarks.

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
