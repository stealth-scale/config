# Architecture Decision Records

One decision per record, with the options we rejected and the trade-offs we accepted. Once an ADR is
accepted we do not change it. To change a decision, write a new ADR that supersedes the old one.

| #                                                                    | Title                                                | Status   |
| -------------------------------------------------------------------- | ---------------------------------------------------- | -------- |
| [0001](0001-use-adrs-for-architecture-decisions.md)                  | Use ADRs for architecture decisions                  | Accepted |
| [0002](0002-keep-the-layer-kernel-in-its-own-package.md)             | Keep the layer kernel in its own package             | Accepted |
| [0003](0003-state-lint-and-fmt-at-the-workspace-root-only.md)        | State lint and fmt at the workspace root only        | Accepted |
| [0004](0004-name-the-ci-steps-in-the-config-and-never-cache-them.md) | Name the CI steps in the config and never cache them | Accepted |
| [0005](0005-require-a-reason-on-every-layer-but-a-preset.md)         | Require a reason on every layer but a preset         | Accepted |

Documents are numbered and never renumbered. Rejected and superseded records stay on disk, because
they are the record of why not.
