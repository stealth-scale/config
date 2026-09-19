# @stealthscale/vite-plugin-specimen

## 0.2.0

### Minor Changes

- [#34](https://github.com/stealth-scale/config/pull/34) [`e94c22a`](https://github.com/stealth-scale/config/commit/e94c22a6c39e1c13d8f99b46334ae8ecc7b65192) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-plugin-specimen: classify a dependency's declaration as an option
  
  - A property declared by a package the component's package depends on at run time is an option, the
    transitive dependencies included. A menu root keeps 31 properties instead of five: its four
    variants, and the 27 options the state machine and the packages it depends on declare.
  - A peer is not walked, so the rendering library's attributes and the foundation's style props stay
    under `dropped.foreign`.
  - The index build reads each package directory's manifest once per build when it names the package a
    specimen belongs to.

## 0.1.0

### Minor Changes

- [#29](https://github.com/stealth-scale/config/pull/29) [`578a9bb`](https://github.com/stealth-scale/config/commit/578a9bb016cb3e7e6f33c043d1360839e9a55f11) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - resolve what a page's components accept out of their types
  
  - `props` on the options serves `virtual:specimen-props/<id>`, which maps every part onto the props
    it takes, the named types those refer to, and what was dropped.
  - Classify a property by every declaration behind it rather than the first, which keeps `gap` on a
    list and `aria-label` on an icon button where the style props and the rendering library share
    those names.
  - Drop a property with no declaration at all, which is what a styling condition resolves to, so no
    pattern names the conditions.
  - Read a recipe file for a variant and the component's own package for an option, both through the
    compiler's own metadata for where a file sits, so a repository states no path.
  - Report the dropped counts rather than hiding them. A button resolves to 1341 properties, six of
    which are its own.
  - Expand a union written under a name into its options, so `size: Scale` reads as its eight steps.
  - Skip a type from TypeScript's own libraries.
  - `typescript` is an optional peer, loaded on the first page that carries props.
  
  218 tests, 100% on all four metrics.

- [#29](https://github.com/stealth-scale/config/pull/29) [`c68ac09`](https://github.com/stealth-scale/config/commit/c68ac0960da80e74da7e7444c4b9e89d6380eba2) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - add the specimen index plugin
  
  - Parse `id`, `group`, `title` and `about` out of a specimen's default export.
  - Serve `virtual:specimen-index` as one listing per file with a dynamic import per page, and
    `virtual:specimen-fragments/<id>` as one snippet per scene.
  - Serve both without a source map, which was four fifths of the payload.
  - List a file that declares no page with the reason as its opening and a rejecting loader, and throw
    on a build instead.
  - Refuse the second of two files declaring one identifier and name the first.
  - Reload the index when a page appears, disappears, or changes its metadata, and leave it alone when
    an edit changes only a scene.
  
  138 tests, 100% on all four metrics.
