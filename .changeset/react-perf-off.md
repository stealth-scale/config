---
"@stealthscale/vite-config-react": minor
---

Stop enabling the `react-perf` lint plugin. Every rule it carries asks for a value to be memoised by
hand — an array, an object, a function or an element passed as a prop — and this package turns the
React Compiler on by default, which memoises all four. A repository taking `react.workspace()` got
both, so it was told to write out memoisation the compiler had already done, giving the compiler
more to reason about for an answer it had reached on its own. A repository that turns the compiler
off wants those rules and contributes the plugin to `lint.plugins` itself.
