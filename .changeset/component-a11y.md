---
"@stealthscale/component-a11y": patch
---

component-a11y: let a roving focus item hold a ref to any element

- `RovingFocus.Item` typed its `ref` as `HTMLDivElement`, which is what the item draws when nothing
  else is asked for. An item drawn as a button or a link could not be given a ref of its own
  element, so a caller who needed one wrote an assertion or dropped the ref.
- The type is now `Ref<HTMLElement>`, which every element the item can draw satisfies.
