<!--
The title takes the form of a commit subject, because the merge uses it.
docs/standards/commit-messages.md sets the form.
-->

## What changed

<!--
Open with a paragraph only where a reader would otherwise ask why this is one
pull request. Then one bullet per change, naming the mechanism, the prop, the
token or the number.
-->

-

## How it was checked

<!--
The gate run with its figures, as `vp run ci` reported them. Name anything you
could not check here and say why, so a reviewer knows what CI is carrying.
-->

## Checklist

- [ ] `pnpm run ready` passes, or `vp run ci` on a bootstrapped checkout.
- [ ] A changeset per published package a consumer would notice, named after the package.
- [ ] The standards under [docs/standards/](../docs/standards/) hold for the commit messages, the
      test names and the doc comments.
- [ ] An [RFC](../docs/rfc/) where this alters a published interface, and an [ADR](../docs/adr/)
      where it constrains later work.
