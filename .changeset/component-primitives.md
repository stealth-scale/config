---
"@stealthscale/component-primitives": minor
---

component-primitives: publish the portal

- `Portal` draws what it holds at the document's body, or at a `container` a caller names, so a box
  positioned against the viewport is not clipped or stacked by the page it was written in. A caller
  who wants the content where it was written passes `disabled` rather than leaving the portal out.
- The portal draws nothing until it has mounted, so a page rendered to a string carries no portalled
  content and the first client render matches it.
