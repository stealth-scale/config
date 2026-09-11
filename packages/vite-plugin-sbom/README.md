# @stealthscale/vite-plugin-sbom

A CycloneDX 1.7 bill of materials listing every package a build put into the bundle, written beside
the bundle itself.

A bundle is the one artefact where "what is in this" has no answer anybody can read: every
dependency has been inlined, renamed and minified into a file that names none of them. This is that
answer, written by the thing that did the inlining and so the only thing that knows.

```bash
pnpm add -D @stealthscale/vite-plugin-sbom @stealthscale/vite-plugin-base
```

```ts
import { sbom } from "@stealthscale/vite-plugin-sbom";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sbom({ type: "application" })],
});
```

Writes `cyclonedx/bom.json` into the output directory.

## Options

| Option         | Default                  | What it decides                                  |
| -------------- | ------------------------ | ------------------------------------------------ |
| `paths`        | `["cyclonedx/bom.json"]` | Where the document is written, one copy per path |
| `serialNumber` | `false`                  | Whether the document carries a random identity   |
| `timestamp`    | `false`                  | Whether it records when it was written           |
| `supplier`     | none                     | `{ name, url }` of whoever supplied it           |
| `type`         | `"library"`              | `"application"` or `"library"`                   |

Nothing is derived. `serialNumber` and `timestamp` are separate because they are separately wanted:
a reproducible release may carry an identity and no clock reading. Both are off by default, so two
builds of one commit produce the same bytes until you ask otherwise.

A deployment usually wants a second copy at `.well-known/sbom`, which is where a scanner looks at
something already running:

```ts
sbom({ paths: ["cyclonedx/bom.json", ".well-known/sbom"], type: "application" });
```

## The document

**Components** come from the module graph rather than from a manifest, so what is listed is what
arrived — including what arrived through something else.

**Dependency edges** are drawn from what each package's modules imported, not from what its manifest
declared.

**purl** identifies every component, which is what an advisory database keys on and what the
document uses as its `bom-ref`. A package installed from git carries its source in a qualifier:

```
pkg:npm/once@1.4.1?vcs_url=github%3Aisaacs%2Fonce%230fbb41e
```

**Hashes** are SHA-512, read from the lockfile. A package manager writes little or nothing into an
installed package — bun writes none of it — so the lockfile is the only place the integrity of what
was installed survives. `pnpm-lock.yaml` and `bun.lock` are both read; the reader list in
`locked.ts` is where npm would go.

**Licences** are recorded twice: the SPDX expression the manifest declares, and the text of the
`LICENSE` file beside it, base64-encoded as evidence. The two disagree often enough that a licence
review needs both.

**The toolchain** is derived, not asked for. `vite` and `rolldown` report their own versions at run
time, so what lands is what actually ran; beside them go the tools the described package declares in
`devDependencies`.

## Where it describes

The directory comes from `configResolved.root`. The plugin is not told, and takes no argument for it
— under a task runner the working directory is the workspace root, so a plugin that reads that
describes the wrong package.

## Requires

Vite 8 or later. The plugin reads `rolldownVersion` from `vite`, which a rollup-based Vite does not
export.

## Licence

MIT
