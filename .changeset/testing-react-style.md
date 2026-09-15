---
"@stealthscale/testing-react": minor
---

testing-react: read the style attribute a component set

A count a caller works out at run time cannot be a class, so a component hands it to a custom
property and its recipe reads it from there. `Rendered` did not carry `style`, so no specification
could check that the value arrived.

`Rendered` is now `Element & ElementCSSInlineStyle & HTMLOrSVGElement`, which every element a
component in this design system renders satisfies.
