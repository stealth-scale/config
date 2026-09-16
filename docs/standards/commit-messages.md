# Commit messages

A commit message takes the form `type(scope): summary`, and the scope is optional. The `commit-msg`
hook runs commitlint on every commit, and `commitlint.config.ts` holds what it checks.

```
fix(vite-config-css): reject a declaration marked important

- Report the file, the selector and the declaration in the error.
- Cover the written and the computed spelling in check.spec.ts.
```

The commit records what changed. Why the approach works belongs in an ADR, and the working session
that produced the change belongs nowhere.

## Types

| Type       | What it covers                                          |
| ---------- | ------------------------------------------------------- |
| `build`    | The build system, the package manifests or a dependency |
| `chore`    | Repository upkeep that changes no published output      |
| `ci`       | A workflow file or a CI script                          |
| `docs`     | Documentation only                                      |
| `feat`     | A new capability a consumer can use                     |
| `fix`      | A defect in behaviour a consumer relies on              |
| `perf`     | A change that makes an existing behaviour faster        |
| `refactor` | A change that alters neither behaviour nor performance  |
| `revert`   | An earlier commit taken back                            |
| `test`     | A test added or corrected on its own                    |

Conventional Commits also defines `style`. This repository has no use for it, because `vp fmt`
settles formatting before a commit exists.

## Scope

The scope is the directory name under `packages/`, without the `@stealthscale/` prefix, as in
`vite-config-core` or `testing-react`. Omit the scope for a change spanning packages, for the
workspace root and for an example.

Commitlint reads the list from the tree, so a new package is a scope as soon as it has a manifest.

## The summary

- Write it in the imperative and in lower case.
- Name the mechanism, not the goal. A reader who wants the goal reads the body.
- Keep the summary itself under 60 characters. The whole header has 100, and the scope spends some
  of them: `refactor(vite-config-typescript): ` is already 34.
- End it without a full stop.
- Stop where the change stops. A trailing `, so …`, `, which …` or `, not …` is body material.

| Rejected                                                                                   | Written out                                                        |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `fix(vite-config-css): improve check performance`                                          | `fix(vite-config-css): walk the selectors in one pass`             |
| `build: pin pnpm exactly, so the action resolves no range`                                 | `build: pin pnpm exactly`                                          |
| `feat(vite-config): a retry wrapper around the upload client`                              | `feat(vite-config): retry uploads three times on 5xx`              |
| `feat(testing-react): register themes from installed dependencies, not only vendored ones` | `feat(testing-react): register themes from installed dependencies` |
| `Add an option to suppress notices`                                                        | `feat(vite-config): add an option to suppress notices`             |

The last two show the failure that survives every other check. The subject names the change and then
keeps going, into the contrast or the reason.

## The body

- Write bullets, one fact per line, wrapped at 72 characters.
- Open with one paragraph only where a reader would otherwise ask why this is a single commit.
- Close with the measured result where there is one, and give the number.

A whole message:

```
perf(vite-config-core): index layers by name instead of scanning

Every removal scanned the contribution list from the top, so a config
with 40 layers walked 800 entries to resolve 20 removals.

- Build a name index once, at the start of the removal pass.
- Look each removal up in the index rather than scanning.
- Cover a removal naming a layer that is absent in layer.spec.ts.

Composing the app-host example falls from 240ms to 12ms.
```

## What never appears

- **Trailers.** No `Signed-off-by`, no `Co-authored-by`, no verification line and no attribution
  line. Delete whatever the tooling offers to append.
- **The working session.** Which tools ran, what was tried first, and the order in which things were
  discovered all stay out.
- **Design rationale.** Why this approach and what it rules out are real questions, and an ADR
  answers them.
- **A plan.** What the change leaves room for later is not part of what changed.

The same change written badly:

```
fix(vite-config-core): improve removal performance

I started by profiling the compose path and noticed the removals were
slow, so I tried caching the whole config first, which did not help.
After some thought a name index is the right shape, since indexing the
contribution list is the cleanest way to bound the scan and leaves room
for per-package indexes later.

- Various improvements to the layer kernel
- Added tests
```

| Fault                                            | Where                                                            |
| ------------------------------------------------ | ---------------------------------------------------------------- |
| The subject states a goal instead of a mechanism | `improve removal performance`                                    |
| The body narrates the session                    | `I started by profiling`, `tried caching the whole config first` |
| Design rationale that belongs in an ADR          | `the cleanest way to bound the scan`                             |
| A plan rather than a change                      | `leaves room for per-package indexes later`                      |
| Padding where the mechanism belongs              | `Various improvements`                                           |
| A bullet in the past tense                       | `Added tests`                                                    |
| Every measurement dropped                        | no 800 entries, no 240ms, no 12ms                                |
