# @stealthscale/component-navigation

## 0.1.1

### Patch Changes

- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/config/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`03d7d45`](https://github.com/stealth-scale/config/commit/03d7d4596ab137b8460b355bf72f4ad3519025bc) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-navigation: publish the link and the breadcrumb trail
  
  - `Link` draws words a person follows to somewhere else. The ink, the visited ink, the cursor and
    the focus ring all come from the theme's own link fragment, so a theme decides what a link looks
    like once for every link. Its one axis decides whether the underline is drawn at rest or only
    under a pointer, and both looks underline under one.
  - `Breadcrumb` draws the path from the front of a site to the page a person is on, composed as
    `Breadcrumb.Root` holding a list of crumbs. The size sets the text on the root and the gap on the
    list, so every part reads at one size by inheriting it.
  - The last crumb is `Breadcrumb.CurrentLink` rather than a link. It draws a span carrying
    `aria-current="page"`, which tells a screen reader which crumb is where the reader is, and a link
    to the page already open would be a control that does nothing.
  - The landmark is named `Breadcrumb` by default, because a page usually holds more than one
    navigation landmark and an unnamed one is announced with nothing to tell it from the others. The
    list states its own list role, because a list drawn with no marker loses that role in Safari. The
    separator sits between two crumbs as a row of the list rather than inside one, so a screen reader
    counting the list counts the crumbs, and it carries `aria-hidden` because the order is already in
    the list.

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
