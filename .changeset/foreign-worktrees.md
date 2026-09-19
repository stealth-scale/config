---
"@stealthscale/vite-config": patch
"@stealthscale/vite-config-plain": patch
---

walk past the worktrees an agent session checks out

`.claude` holds a worktree per session, each a second copy of the repository. A run from the root
descended into them, counting every file twice and running every specification again: 2090 of 3016
files in one root coverage report came from a worktree, which put the report at 32% against a
threshold of 100%.
