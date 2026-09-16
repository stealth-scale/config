---
"@stealthscale/vite-plugin-sbom": minor
---

vite-plugin-sbom: rename the options record to Described

- `Described` replaces `Stated` as the name of the options record. `@stealthscale/vite-plugin-base`
  also exports a `Stated`, and two imports of one name meant two things.
- The plugin is packed under `@stealthscale/vite-config-plain` rather than under a copy of the node
  tier.
- `engines.node` is `>=26.0.0`.
- `README.md` ships in the tarball, listing every `Described` and `Supplier` field against its
  default, and what the document records.
- `description` is a sentence naming what the package does.
