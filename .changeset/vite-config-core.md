---
"@stealthscale/vite-config-core": minor
---

Find the workspace root under pnpm, which states its directories in `pnpm-workspace.yaml` rather
than in the manifest. Without that, `context.root` fell back to the package being configured and
`context.manifest.workspaces` was undefined throughout a pnpm repository, so any layer telling a
root apart from a package read the wrong answer. npm, bun and yarn are unchanged, and a repository
stating a workspace in both places is still answered from the manifest.
