/**
 * A bill of materials for what a build reached, and the toolchain that produced it.
 *
 * @packageDocumentation
 */

import { Contrib, Enums, Models, Serialize, Spec } from "@cyclonedx/cyclonedx-library";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { PackageURL } from "packageurl-js";
import parse from "spdx-expression-parse";
import { rolldownVersion, version } from "vite";

import {
  type Bundling,
  licensed,
  type Manifest,
  manifestAt,
  type Plugin,
  plugin,
  type Reached,
  reached,
  text,
} from "@stealthscale/vite-plugin-base";

import { type Installed, locked } from "#locked.ts";

/**
 * Where the document is written when a caller names nowhere else.
 */
const AT = "cyclonedx/bom.json";

/**
 * Who supplied what a build produced.
 */
export interface Supplier {
  /**
   * The organisation's registered name, since a document like this is read by whoever has to write
   * to somebody about it.
   */
  name: string;

  /**
   * Where to read about it.
   */
  url: readonly string[];
}

/**
 * Describes a bill of materials.
 */
export interface Described {
  /**
   * Where the document is written, relative to the output directory.
   *
   * More than one path writes more than one copy. A deployment usually wants a second at
   * `.well-known/sbom`, which is where a scanner looks on something already running; a tarball
   * wants only the first, because nothing serves a tarball.
   *
   * Whether a given build is one or the other is not this plugin's to know, so it is asked rather
   * than worked out.
   */
  paths?: readonly string[];

  /**
   * Whether the document carries a serial number.
   *
   * One document's identity, which a scanner tracks it by. It is also random, so two builds of one
   * commit differ by it — which is why it is asked for rather than always written.
   */
  serialNumber?: boolean;

  /**
   * Who supplied it.
   */
  supplier?: Supplier;

  /**
   * Whether the document says when it was written.
   *
   * Separate from the serial number because they are separately wanted: a reproducible release may
   * carry an identity and no clock reading.
   */
  timestamp?: boolean;

  /**
   * What is being described: something deployed, or something installed.
   */
  type?: "application" | "library";
}

/**
 * Refuses a licence string that is not a valid SPDX expression.
 *
 * The factory asks for something that throws rather than something that answers, so what the parser
 * returns is dropped. What it is for is telling `MIT OR Apache-2.0` — an expression — apart from a
 * plain identifier or a name somebody invented, which is the difference between a document a
 * licence review can act on and one holding strings.
 *
 * @param held - The licence, as the manifest states it.
 * @throws Error Where it is not an expression.
 */
function expression(held: string): void {
  parse(held);
}

/**
 * Builds the components, reading a licence as the expression it is.
 *
 * @returns The builder.
 */
function building(): Contrib.FromNodePackageJson.Builders.ComponentBuilder {
  return new Contrib.FromNodePackageJson.Builders.ComponentBuilder(
    new Contrib.FromNodePackageJson.Factories.ExternalReferenceFactory(),
    new Contrib.License.Factories.LicenseFactory(expression),
  );
}

/**
 * Reads where a package was actually installed from.
 *
 * A package manager writes this into the installed copy's manifest: npm as `_resolved`, and a
 * registry tarball as `dist.tarball`. Bun writes neither, so under bun there is nothing here to
 * read and every package looks like a registry one.
 *
 * @param manifest - The installed package's manifest.
 * @returns The URL it came from, or nothing where the manager recorded none.
 */
function installedFrom(manifest: Manifest): string | undefined {
  const dist = manifest["dist"];
  const tarball =
    typeof dist === "object" && dist !== null
      ? text(Object.fromEntries(Object.entries(dist)), "tarball")
      : undefined;

  return text(manifest, "_resolved") ?? text(manifest, "resolved") ?? tarball;
}

/**
 * Says where a package came from, where that is not the default registry.
 *
 * A package URL means `registry.npmjs.org` unless it says otherwise, so a package from GitHub
 * Packages, a company registry or a git remote needs the difference written down — otherwise a
 * scanner looks up a public package of the same name and answers about something else entirely.
 *
 * A git remote is recorded as `vcs_url` and anything else as `repository_url`, which is what the
 * package URL specification asks of an npm package that did not come from the default registry.
 *
 * The lockfile is asked first and the manifest second, because only one of them can answer under a
 * given package manager: bun writes nothing into an installed package, npm writes `_resolved`.
 *
 * @param manifest - The installed package's manifest.
 * @param installed - The lockfile's record for it.
 * @returns The qualifiers, or nothing where it came from the default registry.
 */
function qualifiers(manifest: Manifest, installed?: Installed): null | Record<string, string> {
  const held = installed?.registry ?? installed?.resolution ?? installedFrom(manifest);

  if (
    held === undefined ||
    /^\d/u.test(held) ||
    Contrib.FromNodePackageJson.Utils.defaultRegistryMatcher.test(held)
  ) {
    return null;
  }

  return /^(?:git[+:]|ssh:|github:|gitlab:|bitbucket:)|\.git(?:#|$)/u.test(held)
    ? { vcs_url: held }
    : { repository_url: held };
}

/**
 * Records the hash the install was verified against.
 *
 * Lets a reader check that the component in front of them is the one this describes, which is the
 * difference between an inventory and a claim.
 *
 * @param component - The component to attach to.
 * @param installed - The lockfile's record for it.
 */
function verified(component: Models.Component, installed?: Installed): void {
  if (installed?.integrity === undefined) return;

  try {
    const [algorithm, value] = Contrib.FromNodePackageJson.Utils.parsePackageIntegrity(
      installed.integrity,
    );

    component.hashes.set(algorithm, value);
  } catch {
    // An integrity this cannot read says nothing worth recording, and is not worth failing over.
  }
}

/**
 * Names a component the way a scanner looks one up.
 *
 * A package URL rather than the generated reference the library mints on its own. It is what every
 * advisory database is keyed on, so a document without one lists what is installed while saying
 * nothing a scanner can act on. It doubles as what the dependency graph points with, which makes
 * that graph readable rather than a table of opaque handles.
 *
 * @param component - The component to name.
 * @param manifest - The manifest it was built from.
 * @param installed - The lockfile's record for it.
 */
function identify(component: Models.Component, manifest: Manifest, installed?: Installed): void {
  const url = new PackageURL(
    "npm",
    component.group ?? null,
    component.name,
    component.version ?? null,
    qualifiers(manifest, installed),
    null,
  ).toString();

  component.purl = url;
  component.bomRef.value = url;
  verified(component, installed);
}

/**
 * Attaches the licence files a package ships, as evidence for what it says it is.
 *
 * The manifest's `license` field is a declaration; this is the text beside it. Both are recorded,
 * because a review seeing only the declaration cannot tell a mislabelled package from a correct
 * one.
 *
 * Base64, which is what the format asks for: a licence is prose with newlines and occasionally
 * something outside ASCII, and encoding it is what keeps the document valid JSON.
 *
 * @param component - The component to attach to.
 * @param at - The package's directory.
 */
function evidence(component: Models.Component, at: string): void {
  const held = licensed(at);

  if (held.length === 0) return;

  const found = new Models.ComponentEvidence();

  for (const one of held) {
    const license = new Models.NamedLicense(`file: ${one.named}`);

    license.text = new Models.Attachment(Buffer.from(one.text, "utf8").toString("base64"), {
      contentType: "text/plain",
      encoding: Enums.AttachmentEncoding.Base64,
    });

    found.licenses.add(license);
  }

  component.evidence = found;
}

/**
 * Reads the manifest of a package by the name it is imported under.
 *
 * @param at - Where the package being described is.
 * @param named - The tool's name.
 * @returns Its manifest, or nothing where the tool is not installed.
 */
function toolAt(at: string, named: string): Manifest | undefined {
  try {
    return manifestAt(dirname(createRequire(`${at}/`).resolve(`${named}/package.json`)));
  } catch {
    return undefined;
  }
}

/**
 * Records what built this, each tool as a component of the document rather than of the artefact.
 *
 * Derived rather than asked for. The bundler reports its own version at run time, so what lands
 * here is what actually ran — not what happened to be resolvable, which is the mistake that put a
 * bundler into every document the plugin this replaces wrote. Beside those go the tools the package
 * declares it is built with, read from its own manifest and passed over where one is absent.
 *
 * @param bom - The document.
 * @param at - The package's directory.
 * @param components - The builder.
 */
function toolchain(
  bom: Models.Bom,
  at: string,
  components: Contrib.FromNodePackageJson.Builders.ComponentBuilder,
  installed: ReadonlyMap<string, Installed>,
): void {
  bom.metadata.tools.components.add(
    new Models.Component(Enums.ComponentType.Application, "vite", { version }),
  );
  bom.metadata.tools.components.add(
    new Models.Component(Enums.ComponentType.Application, "rolldown", {
      version: rolldownVersion,
    }),
  );

  const declared = manifestAt(at)?.["devDependencies"];
  const names = typeof declared === "object" && declared !== null ? Object.keys(declared) : [];

  for (const named of names) {
    const manifest = toolAt(at, named);
    const held = manifest === undefined ? undefined : components.makeComponent(manifest);

    if (held !== undefined && manifest !== undefined) {
      identify(held, manifest, installed.get(named));
      bom.metadata.tools.components.add(held);
    }
  }
}

/**
 * Says who this is, who supplied it, and whether it is a release.
 *
 * @param bom - The document.
 * @param stated - The thing being described.
 * @param at - The package's directory.
 * @param components - The builder.
 */
function described(
  bom: Models.Bom,
  stated: Described,
  at: string,
  components: Contrib.FromNodePackageJson.Builders.ComponentBuilder,
): void {
  const manifest = manifestAt(at) ?? {};
  const root = components.makeComponent(
    manifest,
    stated.type === "application" ? Enums.ComponentType.Application : Enums.ComponentType.Library,
  );

  if (root !== undefined) {
    identify(root, manifest);
    evidence(root, at);
    bom.metadata.component = root;
  }

  bom.metadata.lifecycles.add(Enums.LifecyclePhase.Build);

  if (stated.supplier !== undefined) {
    bom.metadata.supplier = new Models.OrganizationalEntity({
      name: stated.supplier.name,
      url: new Set(stated.supplier.url),
    });
  }

  if (stated.timestamp === true) bom.metadata.timestamp = new Date();
  if (stated.serialNumber === true) bom.serialNumber = Contrib.Bom.Utils.randomSerialNumber();
}

/**
 * Adds every package the build reached, and the edges between them.
 *
 * Two passes, because an edge cannot point at a component that does not exist yet.
 *
 * @param bom - The document.
 * @param found - The packages the build reached.
 * @param components - The builder.
 */
function inventory(
  bom: Models.Bom,
  found: ReadonlyMap<string, Reached>,
  components: Contrib.FromNodePackageJson.Builders.ComponentBuilder,
  installed: ReadonlyMap<string, Installed>,
): void {
  const made = new Map<string, Models.Component>();

  for (const [at, one] of found) {
    const held = components.makeComponent(one.manifest, Enums.ComponentType.Library);

    if (held === undefined) continue;

    identify(held, one.manifest, installed.get(one.named));
    evidence(held, at);
    made.set(at, held);
    bom.components.add(held);
  }

  for (const [at, one] of found) {
    const from = made.get(at);

    for (const to of one.dependsOn) {
      const target = made.get(to);

      if (from !== undefined && target !== undefined) from.dependencies.add(target.bomRef);
    }
  }
}

/**
 * Builds the document.
 *
 * @param stated - The thing being described. `Described` documents every member.
 * @param bundling - The build to read.
 * @param at - The directory being built.
 * @returns The document, serialised.
 */
export function written(stated: Described, bundling: Bundling, at: string): string {
  const components = building();
  const bom = new Models.Bom();
  const installed = locked(at);

  described(bom, stated, at, components);
  toolchain(bom, at, components, installed);
  inventory(bom, reached(bundling), components, installed);

  return new Serialize.JsonSerializer(
    new Serialize.JSON.Normalize.Factory(Spec.Spec1dot7),
  ).serialize(bom, { sortLists: true });
}

/**
 * Writes down what the build was made of, beside what it produced.
 *
 * A bundle is the one artefact where "what is in this" has no answer anybody can read: every
 * dependency has been inlined, renamed and minified into a file that names none of them. This is
 * that answer, written by the thing that did the inlining and so the only thing that knows.
 *
 * The components come from the module graph rather than from a manifest, which is the difference
 * that matters. A manifest names what was asked for; the graph holds what arrived, including what
 * arrived through something else.
 *
 * @param stated - The thing being described. `Described` documents every member.
 * @returns The plugin.
 */
export function sbom(stated: Described = {}): Plugin {
  return plugin({
    name: "stealth:sbom",

    /**
     * Writes the document beside what the bundler produced.
     *
     * @param bundling - The build to read.
     * @param at - The directory being built.
     */
    writes(bundling, at) {
      const source = written(stated, bundling, at);

      for (const fileName of stated.paths ?? [AT]) {
        bundling.emitFile({ fileName, source, type: "asset" });
      }
    },
  });
}
