# Contributing

Run the gate before you open a pull request:

```bash
pnpm install
pnpm run ready
```

`ready` packs every package under `packages/` in dependency order, then builds, checks and tests.
Installing also writes the git hooks: `pre-commit` runs `vp staged` over the files you staged, and
`commit-msg` runs commitlint. Both are declared in `lefthook.yml`. Once a checkout is bootstrapped,
`vp run ci` runs the same three steps. A flag for the runner goes before the task name, so verbose
is `vp run -v ci`.

## The standards

Each document states the rules a machine cannot check, with the examples this repository has
rejected and what was written instead.

| Standard         | Read                                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| A commit message | [docs/standards/commit-messages.md](docs/standards/commit-messages.md) |
| A test name      | [docs/standards/test-names.md](docs/standards/test-names.md)           |
| A doc comment    | [docs/standards/docblocks.md](docs/standards/docblocks.md)             |

`vp check` reports what is checkable, and the three documents cover what it cannot see. A rule
stated in one of them is never repeated in a README or a package.

## Changesets

Add a changeset for any change that a consumer of a published package would notice:

```bash
pnpm changeset
```

Write one changeset per package, named after the package, and split a change spanning packages
across their files. Use the register of a commit body: the first line names the package and the
mechanism, and the bullets give the prop, the token or the number.

## Pull requests

Open the pull request against `main`. The title takes the form of a commit subject, since the merge
uses it. CI runs `vp run ci` on every push, and it must pass before review.

Where a change alters a published interface or has competing approaches worth comparing, write an
[RFC](docs/rfc/) first. Where a decision constrains later work, record it as an [ADR](docs/adr/)
once it is accepted. Neither holds a standard: an ADR is never edited after it is accepted, and a
standard is edited whenever it is refined.
