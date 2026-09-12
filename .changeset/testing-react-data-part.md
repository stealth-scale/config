---
"@stealthscale/testing-react": minor
---

Read a component through `data-part` rather than `data-slot`, which is the attribute Ark marks each
piece of an anatomy with and the one every component here actually renders. Nothing carried a
`data-slot`, so every reader in this package matched nothing.

Adds `parts`, for the pieces a component repeats, and `only`, for the single element a render
produced — which a specification otherwise reaches by asserting `firstElementChild` is not null, and
that assertion is one the house linter refuses.

Removes `describeContract`. It held a component to a contract about forwarding refs, merging
`className` and spreading props, which is a contract worth asserting where components are written by
hand. Here they are re-exports of Chakra and Ark, so the suite tested a dependency against
conventions from the design system this package was ported from. `vitest` goes with it: nothing here
registers tests any more, so the runner is no longer a peer.
