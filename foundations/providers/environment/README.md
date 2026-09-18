# @stealthscale/provider-environment

`@stealthscale/provider-environment` names the node a subtree is rooted in. A portal attaches to it
and a measurement is taken against it, and inside an iframe or a shadow root that is not the page's
own document.

## Install

```bash
pnpm add @stealthscale/provider-environment
```

The package peers on `react` and depends on nothing else.

## An application that renders in the page

Nothing to do. Outside every provider `useRootNode()` returns a getter for `globalThis.document`, so
a component reads the same thing whether an application mounted anything or not.

## An application that renders elsewhere

```tsx
import { EnvironmentProvider } from "@stealthscale/provider-environment";

<EnvironmentProvider value={shadowRoot}>
  <App />
</EnvironmentProvider>;
```

`value` takes the node or a getter for it. Render it outermost, because everything below is placed
and measured against whatever it names.

## Reading it

`useRootNode()` returns the getter rather than the node. A Zag machine's `getRootNode` option takes
a function and so does its `Portal`, so a component passes the result to either without wrapping it.

```tsx
const getRootNode = useRootNode();

usePopoverMachine({ ...options, getRootNode });
```

For a measurement or a write to `documentElement`, `useEnvironmentDocument()` returns the document
instead. A shadow root is not a document, so its owner is returned. `documentOf` does the same for a
node an effect already holds.

## What breaks without it

A portal appended to the page's document from inside a shadow root leaves the shadow root's styles
behind, so the panel renders unstyled. A measurement taken against the page inside an iframe reads
the frame's box rather than the iframe's, so a popover is positioned off-screen.
