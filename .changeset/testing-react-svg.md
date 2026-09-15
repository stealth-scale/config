---
"@stealthscale/testing-react": minor
---

testing-react: read a mark drawn in SVG, not only HTML

An icon renders an `svg`, which is not an `HTMLElement`. `only` threw on one, and `renderedAs` and
`violations` compared its lowercase tag name against the upper-cased name every other component
reports, so a conforming icon failed every check.

- `only`, `part` and `parts` answer `Rendered`, which is `Element & HTMLOrSVGElement`; `only` still
  throws for anything that is neither
- `renderedAs` and `violations` upper-case the tag name, so `element: "SVG"` reads the way
  `element: "DIV"` does
