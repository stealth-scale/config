# @stealthscale/component-primitives

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`a40abdd`](https://github.com/stealth-scale/config/commit/a40abdd40b847dcafd687eeb83a4a286d07ee88d) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-primitives: publish the portal
  
  - `Portal` draws what it holds at the document's body, or at a `container` a caller names, so a box
    positioned against the viewport is not clipped or stacked by the page it was written in. A caller
    who wants the content where it was written passes `disabled` rather than leaving the portal out.
  - The portal draws nothing until it has mounted, so a page rendered to a string carries no portalled
    content and the first client render matches it.
