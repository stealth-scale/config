# @stealthscale/testing-react

## 0.3.0

### Minor Changes

- [`be64d43`](https://github.com/stealth-scale/config/commit/be64d437b98a7eb6a886941521f6a8e04d187278) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Read the component contract a wrapper breaks
  
  - add `violations(Component, options)`: mounts once per check, answers what it does not keep
  - always: renders an element, merges `className` without dropping its own, forwards `ref`, spreads
    props it does not name
  - on request: `element` names the tag, `children`, `asChild` — none of them every component's
  - violations rather than a verdict, so nothing here asserts and the package needs no test runner

## 0.2.0

### Minor Changes

- [`b6f0e92`](https://github.com/stealth-scale/config/commit/b6f0e92c3510b5bc7e26d1822d436ba0445f2008) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Read a component through `data-part` rather than `data-slot`, which is the attribute Ark marks each
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
