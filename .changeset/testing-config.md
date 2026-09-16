---
"@stealthscale/testing-config": minor
---

testing-config: publish the conformance suite for config and plugin packages

- `violations({ at, kind, module })` reads a package and returns each part of the house contract it
  breaks, as one sentence per breach.
- Thirteen checks cover the manifest, the barrel, the README block table, the layers each factory
  returns, the tiers, and a plugin's name and peer.
- `arguments` supplies what a factory with required parameters is called with. `skip` turns a check
  off with a reason, and `only` narrows a run.
- `README.md` ships in the tarball, listing all thirteen checks against what each one reports.
- `description` names the `library` kind beside `config` and `plugin`.
