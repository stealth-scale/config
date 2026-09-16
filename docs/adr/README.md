# Architecture Decision Records

An ADR records one decision, the options that were rejected and the trade-offs that were accepted.
An accepted ADR is not changed. To change a decision, write a new ADR that supersedes the old one.

| #                                                                    | Title                                                            | Status   |
| -------------------------------------------------------------------- | ---------------------------------------------------------------- | -------- |
| [0001](0001-use-adrs-for-architecture-decisions.md)                  | Use ADRs for architecture decisions                              | Accepted |
| [0002](0002-keep-the-layer-kernel-in-its-own-package.md)             | Keep the layer kernel in its own package                         | Accepted |
| [0003](0003-state-lint-and-fmt-at-the-workspace-root-only.md)        | State lint and fmt at the workspace root only                    | Accepted |
| [0004](0004-name-the-ci-steps-in-the-config-and-never-cache-them.md) | Name the CI steps in the config and never cache them             | Accepted |
| [0005](0005-require-a-reason-on-every-layer-but-a-preset.md)         | Require a reason on every layer but a preset                     | Accepted |
| [0006](0006-import-vite-and-name-the-toolchain-once.md)              | Import vite in every package and name the toolchain in one place | Accepted |
| [0007](0007-name-a-layer-for-the-call-that-made-it.md)               | Name a layer for the call that made it                           | Accepted |
| [0008](0008-check-every-config-package-with-one-conformance-spec.md) | Check every config package with one conformance spec             | Accepted |

Documents are numbered and never renumbered. Rejected and superseded records stay on disk as the
record of why a decision was not taken.
