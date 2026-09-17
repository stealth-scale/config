---
"@stealthscale/vite-config-react": minor
---

react: run the React Compiler over everything a package renders

- `plugin.compiler()` returns two layers. `react.plugin.compiler` appends the Babel pass to the
  plugins a tier built. `react.plugin.compiler(pack)` gives the packer the same pass, so a library
  publishes memoised components rather than what its author wrote.
- The memo cache is written against the React a build resolves, read from React's own manifest.
  `Compiled.target` overrides that reading, and `layers()` takes the same object in place of `true`.
  A React newer than the compiler has a target for takes the newest one. A React older than 17 fails
  when the configuration is composed, naming the version it read.
- The layer proves the compiler can be loaded while the configuration is composed. Babel resolves a
  preset during a transform, so a package missing `babel-plugin-react-compiler` or
  `@rolldown/plugin-babel` would otherwise build clean and memoise none of it.
- `panicThreshold` is raised from `none` to `critical_errors`. The compiler failing one of its own
  invariants now stops the build rather than leaving a function uncompiled in silence.
- Neither layer applies where the mode is `test`. Each memo cache is a branch nobody wrote and
  coverage counts it, so a package held to full branch coverage would be asked to exercise a
  compiler's caching rather than its own code.
- The pattern the pass reads closes on a query as well as on the end of an identifier, because the
  dev server appends one to every module it re-transforms.
- `Refreshed.compiler` is gone. The React plugin's own option resolves the compiler from the
  plugin's own directory, which an isolated node_modules refuses, and setting it turns fast refresh
  off as well.

The package peers on `@rolldown/plugin-babel` and `babel-plugin-react-compiler`. Hold `@babel/core`
at 7 with an override. Babel 8 took `AssignmentPattern` out of its `LVal` alias, the compiler asks a
node path that question, and under Babel 8 it refuses every `const { a = 1 } = b` and leaves the
whole function uncompiled.
