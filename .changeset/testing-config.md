---
"@stealthscale/testing-config": minor
---

testing-config: hold a package's barrels to a specification where it asks

- `violations` takes `barrels: true`, under which `source.specs` reports a barrel with no
  specification beside it as it reports any other source. A component package asks for it, because a
  barrel there is where a component's public surface is written and where a recipe or a binding
  leaks out.
- The walk into a barrel enters an object once. A React context provider reaches itself through its
  context, and the walk overflowed the stack on a package that published one.
- `source.specs` leaves a module alone whose every export is an `export interface`, as it already
  left one exporting types alone. An interface compiles to nothing, so there is no behaviour to
  write cases against, and the rule asked for a specification that could only assert types.
- `source.declared` reports a package a file under `src` imports that the manifest lists under
  neither `dependencies` nor `peerDependencies`. Neither `publint` nor `attw` reads an import, so a
  package importing something it never declared installs and then fails at run time. A subpath reads
  as the package that publishes it, a relative path and a `node:` builtin are read past, and so is a
  specification, which runs in the workspace. An import written inside a template literal is read
  past too, being code a package generates for somebody else to run.
- `source.jsx` reports a file suffixed `.tsx` that writes no JSX, which sends a reader looking for
  markup that was never written. The other way round needs no check, a compiler refusing JSX in a
  `.ts` file.
- `source.declared` reads past a specifier carrying a URI scheme, not just a `node:` builtin. A
  bundler's virtual module such as `virtual:i18n` is answered by a plugin rather than installed, so
  no manifest declares it. A package name carries no colon and a scoped name opens with `@`, so
  nothing installed matches.
