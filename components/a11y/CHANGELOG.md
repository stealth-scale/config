# @stealthscale/component-a11y

## 0.1.1

### Patch Changes

- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/config/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`752924c`](https://github.com/stealth-scale/config/commit/752924c5174b0d495e6259546ff0fb64ba5d5a37) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-a11y: publish the three components a keyboard and a screen reader need
  
  - `VisuallyHidden` exposes its words to a screen reader and draws them nowhere, and a `focusable`
    one comes into view while focus is on it.
  - `SkipNav.Link` and `SkipNav.Target` carry a keyboard past the navigation. The link is hidden until
    focus reaches it, and the target takes a tab index of minus one so a browser moves focus to it.
  - `RovingFocus.Root` and `RovingFocus.Item` hold one tab stop for a set of controls, which the
    arrows move through. Home and End go to the ends, a disabled item is passed over, the ends join up
    where a caller asks, and the arrows run the other way where the line runs right to left.
  - The preset under `./theme` registers all three recipes.

### Patch Changes

- Updated dependencies [[`614fb9f`](https://github.com/stealth-scale/config/commit/614fb9ff17f757776a5d5132c5d21a3bb6c41efb), [`6ac64f2`](https://github.com/stealth-scale/config/commit/6ac64f2666f92a187fc06d34df1d2cd023266434), [`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/hooks@0.1.0
  - @stealthscale/theme@0.3.0
