---
"@stealthscale/vite-plugin-theme": patch
---

vite-plugin-theme: generate a runtime that writes no slot attribute

- The generated slot binding no longer writes `data-slot` on a part. A part's slot class,
  `card__header`, names the recipe and the slot, and the testing kit reads that class instead.
