---
"@stealthscale/component-a11y": minor
---

component-a11y: publish the three components a keyboard and a screen reader need

- `VisuallyHidden` reads its words to a screen reader and draws them nowhere, and a `focusable` one
  comes into view while focus is on it.
- `SkipNav.Link` and `SkipNav.Target` carry a keyboard past the navigation. The link is hidden until
  focus reaches it, and the target takes a tab index of minus one so a browser moves focus to it.
- `RovingFocus.Root` and `RovingFocus.Item` hold one tab stop for a set of controls, which the
  arrows move through. Home and End go to the ends, a disabled item is passed over, the ends join up
  where a caller asks, and the arrows run the other way where the line runs right to left.
- The preset under `./theme` registers all three recipes.
