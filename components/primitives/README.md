# @stealthscale/component-primitives

Decides what is drawn and where, and draws nothing itself. No component here renders an element of
its own, so the package carries no recipe and no preset, and it reaches an application's bundle
through its barrel alone.

## Install

```bash
pnpm add @stealthscale/component-primitives
```

The package peers on `react` and `react-dom`.

## Portal

Draws what it holds somewhere else in the document rather than where it is written. A box positioned
against the viewport inside a page that clips or stacks is clipped or stacked with it, which is the
reason to use a portal at all.

```tsx
import { Portal } from "@stealthscale/component-primitives";

<Portal>
  <div>Over everything</div>
</Portal>;
<Portal container={panel}>…</Portal>;
<Portal disabled>…</Portal>;
```

The content goes to the document's body where a caller names no `container`. A caller who wants the
content where it was written passes `disabled` rather than leaving the portal out, so the tree is
the same either way.

The portal draws nothing until it has mounted. Drawing on a server is impossible, because a portal
needs a document, and drawing on the first client render instead would be a mismatch a browser
reports. A page rendered to a string therefore carries no portalled content, and the client fills it
in.

## Licence

MIT. See [LICENSE](LICENSE).
