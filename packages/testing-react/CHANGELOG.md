# @stealthscale/testing-react

## 0.7.1

### Patch Changes

- [#17](https://github.com/stealth-scale/config/pull/17) [`2a0aaf2`](https://github.com/stealth-scale/config/commit/2a0aaf2f41b67bcee797d637f83a41a5d4840257) Thanks [@stealth-admin](https://github.com/stealth-admin)! - testing-react: publish the licence and the README, and state the node floor
  
  - The tarball includes `LICENSE` and `README.md`. The README lists every reader, the
    `ConformanceOptions` fields and each phrase a violation is reported as.
  - `engines.node` is `>=26.0.0`.
  - `description` is a sentence naming what the package does.

## 0.7.0

### Minor Changes

- [`996c217`](https://github.com/stealth-scale/config/commit/996c217cf135390cdc20d481c75107180da64f01) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing-react: read a part's ARIA and what it holds
  
  `attr` reads the `data-` a component states about itself. What it owes a screen reader is written on
  `aria-`, which no reader covered, so a specification asserting `aria-current` or `aria-expanded`
  reached for `getAttribute`. `vp check --fix` rewrites that to `dataset`, which a strict `tsconfig`
  then rejects for coming off an index signature.
  
  Nesting had the same gap: an arrow's tip belongs inside the arrow, and saying so took a selector
  written in the specification.
  
  - aria(container, name, attribute): an `aria-` attribute, `undefined` where absent
  - holds(container, outer, inner): whether one part is drawn inside another

## 0.6.0

### Minor Changes

- [`5b8086c`](https://github.com/stealth-scale/config/commit/5b8086c84266aeaf969b4fb5442b14f3bd2f5a39) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing-react: read the style attribute a component set
  
  A count a caller works out at run time cannot be a class, so a component hands it to a custom
  property and its recipe reads it from there. `Rendered` did not carry `style`, so no specification
  could check that the value arrived.
  
  `Rendered` is now `Element & ElementCSSInlineStyle & HTMLOrSVGElement`, which every element a
  component in this design system renders satisfies.

## 0.5.0

### Minor Changes

- [`494d106`](https://github.com/stealth-scale/config/commit/494d106601fd5b1f96e6538e84df303fe05e18ea) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing-react: read a mark drawn in SVG, not only HTML
  
  An icon renders an `svg`, which is not an `HTMLElement`. `only` threw on one, and `renderedAs` and
  `violations` compared its lowercase tag name against the upper-cased name every other component
  reports, so a conforming icon failed every check.
  
  - `only`, `part` and `parts` answer `Rendered`, which is `Element & HTMLOrSVGElement`; `only` still
    throws for anything that is neither
  - `renderedAs` and `violations` upper-case the tag name, so `element: "SVG"` reads the way
    `element: "DIV"` does

## 0.4.0

### Minor Changes

- [`5a3a0ab`](https://github.com/stealth-scale/config/commit/5a3a0ab72646dd938a5355e1cce2842e09bcac8c) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Check a component that cannot be rendered on its own
  
  - `violations` takes `wrapper`, for whatever a component needs above it, and `subject`, for finding
    the element under test inside it. A compound's part needs both
  - a component that throws is reported as throwing, with its message, rather than as rendering
    nothing: a part missing its provider throws, and the two are different bugs

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
