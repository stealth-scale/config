---
"@stealthscale/provider-environment": minor
---

provider-environment: name the node a subtree is rooted in

- `useRootNode()` returns a getter for the page's own document outside every provider, so a
  component reads the same thing whether an application mounted anything or not.
- The getter rather than the node, because a Zag machine's `getRootNode` option takes a function and
  so does its `Portal`. A component passes the result to either without wrapping it.
- `useEnvironmentDocument()` returns the document instead, for a measurement or a write to
  `documentElement`. A shadow root is not a document, so its owner is returned. `documentOf` does
  the same for a node an effect already holds.
- The document is found by node type rather than by `instanceof Document`. A document built by
  `createHTMLDocument`, and any document reached across a realm, is not an instance of the global
  one.
- The package peers on react and depends on nothing else. The platform's version re-exported Ark UI,
  which this repository does not install.
