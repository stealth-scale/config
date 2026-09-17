# Architecture decision records

A record holds one decision that constrains later work, so that someone reading the code in three
years finds out why it works this way without asking a person who has left. Write one when the
decision is made and no credible alternative is still open. Write a proposal first when several
approaches are worth comparing.

A record is not edited once it is accepted, except to change its status. To change a decision, write
a new record and mark the old one superseded.

| ADR                                                                   | Title                                                                            | Status   |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------- |
| [0001](0001-use-adrs-for-architecture-decisions.md)                   | Use ADRs for architecture decisions                                              | Accepted |
| [0002](0002-keep-the-layer-kernel-in-its-own-package.md)              | Keep the layer kernel in its own package                                         | Accepted |
| [0003](0003-state-lint-and-fmt-at-the-workspace-root-only.md)         | State lint and fmt at the workspace root only                                    | Accepted |
| [0004](0004-name-the-ci-steps-in-the-config-and-never-cache-them.md)  | Name the CI steps in the config and never cache them                             | Accepted |
| [0005](0005-require-a-reason-on-every-layer-but-a-preset.md)          | Require a reason on every layer but a preset                                     | Accepted |
| [0006](0006-import-vite-and-name-the-toolchain-once.md)               | Import vite in every package and name the toolchain in one place                 | Accepted |
| [0007](0007-name-a-layer-for-the-call-that-made-it.md)                | Name a layer for the call that made it                                           | Accepted |
| [0008](0008-check-every-config-package-with-one-conformance-spec.md)  | Check every config package with one conformance spec                             | Accepted |
| [0009](0009-style-a-component-through-its-config-recipe-only.md)      | Style a component through its config recipe only                                 | Accepted |
| [0010](0010-generate-the-styling-runtime-in-one-package.md)           | Generate the styling runtime in one package                                      | Accepted |
| [0011](0011-scope-every-theme-under-data-theme.md)                    | Scope every theme under data-theme and list the default first                    | Accepted |
| [0012](0012-load-theme-statements-through-vite.md)                    | Load theme statements through Vite and inline them for the compiler              | Accepted |
| [0013](0013-gate-a-theme-on-the-contract-and-the-contrast-table.md)   | Gate a theme on the contract and the contrast table                              | Accepted |
| [0014](0014-name-a-plugin-for-its-factory-within-its-package.md)      | Name a plugin for its factory within its package                                 | Accepted |
| [0015](0015-bind-a-component-through-the-compilers-factory.md)        | Bind a component through the compiler's factory and change its element with as   | Accepted |
| [0016](0016-name-a-components-files-for-what-they-export.md)          | Name a component's files for what they export and publish its directory's barrel | Accepted |
| [0017](0017-mark-a-bound-component-with-data-recipe-alone.md)         | Mark a bound component with data-recipe alone                                    | Accepted |
| [0018](0018-put-a-specification-beside-every-source-file.md)          | Put a specification beside every source file, the barrels included               | Accepted |
| [0019](0019-give-a-component-an-axis-for-each-value-a-theme-moves.md) | Give a component an axis for each thing the vocabulary lets a theme move on it   | Accepted |

## Status

A record opens as `Proposed` and reaches `Accepted` when the decision is taken. An accepted record
becomes `Superseded` when a later one replaces it, or `Deprecated` when the constraint is dropped
without a replacement.

A superseded record stays on disk with its argument unchanged. The record that replaced it names it,
and it names the record that replaced it.
