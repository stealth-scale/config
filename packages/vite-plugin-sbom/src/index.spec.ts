import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";

import { type Bundling } from "@stealthscale/vite-plugin-base";

import { sbom, written } from "#index.ts";

/**
 * A real integrity, since the parser refuses one of the wrong length.
 */
const INTEGRITY =
  "sha512-1CWR0Ru94zpwIHIAqbDD1zQjyjqszU0cohfGZFH7HiRtUf5ePwwQoer8MfzCiu8m+he5wL8Z/xa1NfoP+FFjnA==";

/**
 * Lays out a workspace: a package to describe, and one installed dependency it reached.
 *
 * @param manifest - What the described package's manifest holds beyond its name.
 * @param dependency - The installed package's manifest, or nothing to install a bare one.
 * @param lockfile - The `packages` entries to write, as JSON text without its braces.
 * @returns Where the described package sits, and the dependency's module.
 */
function workspace(
  manifest: Record<string, unknown> = {},
  dependency?: Record<string, unknown>,
  lockfile = "",
): { readonly at: string; readonly module: string } {
  const root = mkdtempSync(join(tmpdir(), "stealth-sbom-"));
  const at = join(root, "packages", "one");
  const held = join(root, "node_modules", "held");

  mkdirSync(at, { recursive: true });
  writeFileSync(join(at, "package.json"), JSON.stringify({ name: "@acme/one", ...manifest }));
  writeFileSync(join(root, "bun.lock"), `{\n  "packages": {\n${lockfile}\n  },\n}\n`);

  mkdirSync(held, { recursive: true });
  writeFileSync(join(held, "package.json"), JSON.stringify(dependency ?? { name: "held" }));
  writeFileSync(join(held, "index.js"), "");
  writeFileSync(join(held, "LICENSE"), "MIT License\n");

  return { at, module: join(held, "index.js") };
}

/**
 * Stands in for a build that reached the given modules.
 *
 * @param modules - Each module the build reached.
 * @returns Something with the shape the plugin reads.
 */
function building(
  modules: readonly string[] = [],
  imports: Readonly<Record<string, readonly string[]>> = {},
): Bundling {
  return {
    emitFile: () => "",
    getModuleIds: () => modules,
    getModuleInfo: (id: string) => ({ importedIds: imports[id] ?? [] }),
  } as unknown as Bundling;
}

/**
 * Builds a document and reads it back.
 *
 * @param stated - What the plugin was asked for.
 * @param held - The workspace to describe.
 * @param modules - The modules the build reached.
 * @returns The document, parsed.
 */
function document(
  stated: Parameters<typeof written>[0],
  held: ReturnType<typeof workspace>,
  modules: readonly string[] = [],
  imports: Readonly<Record<string, readonly string[]>> = {},
): unknown {
  return JSON.parse(written(stated, building(modules, imports), held.at));
}

/**
 * Reads a nested field out of the document.
 *
 * Read rather than asserted into a shape, because what is being specified is the document a scanner
 * receives. A shape stated here would only restate what the code already believes.
 *
 * @param held - Whatever holds it.
 * @param path - The field names, outermost first.
 * @returns What sits there, or nothing where the path names nothing.
 */
function field(held: unknown, ...path: readonly string[]): unknown {
  return path.reduce<unknown>(
    (one, key) => (typeof one === "object" && one !== null ? Reflect.get(one, key) : undefined),
    held,
  );
}

/**
 * Reads the first component of a document.
 *
 * @param held - The document.
 * @returns That component, or nothing where it holds none.
 */
function first(held: unknown): unknown {
  const components = field(held, "components");

  return Array.isArray(components) ? components[0] : undefined;
}

/**
 * Reads the first entry of a list sitting at a path.
 *
 * @param held - Whatever holds it.
 * @param path - The field names, outermost first.
 * @returns The first entry, or nothing where the path names no list.
 */
function firstOf(held: unknown, ...path: readonly string[]): unknown {
  const found = field(held, ...path);

  return Array.isArray(found) ? found[0] : undefined;
}

test("describes the package it was pointed at, keyed by a package URL", () => {
  const held = document({}, workspace({ version: "1.2.3" }));

  expect(field(held, "metadata", "component", "purl")).toBe("pkg:npm/%40acme/one@1.2.3");
});

test("says whether the thing described is deployed or installed", () => {
  const held = workspace();

  expect(field(document({ type: "application" }, held), "metadata", "component", "type")).toBe(
    "application",
  );
  expect(field(document({ type: "library" }, held), "metadata", "component", "type")).toBe(
    "library",
  );
});

test("records the bundler that actually ran, without being told which", () => {
  const tools = field(document({}, workspace()), "metadata", "tools", "components");
  const named = Array.isArray(tools) ? tools.map((one: unknown) => field(one, "name")) : [];

  expect(named).toContain("rolldown");
  expect(named).toContain("vite");
});

test("lists what the build reached, which a manifest does not name", () => {
  const held = workspace({}, { name: "held", version: "2.0.0" });

  expect(field(first(document({}, held, [held.module])), "purl")).toBe("pkg:npm/held@2.0.0");
});

test("attaches the licence text a package ships, encoded", () => {
  const held = workspace({}, { name: "held", version: "2.0.0" });
  const one = firstOf(first(document({}, held, [held.module])), "evidence", "licenses");
  const text = field(one, "license", "text");
  const content = field(text, "content");

  expect(field(text, "encoding")).toBe("base64");
  expect(Buffer.from(typeof content === "string" ? content : "", "base64").toString()).toContain(
    "MIT License",
  );
});

test("says where a package came from where that is not the default registry", () => {
  const held = workspace(
    {},
    { name: "held", version: "2.0.0" },
    `    "held": ["held@github:acme/held#abc", {}, "acme", "${INTEGRITY}"],`,
  );
  const one = first(document({}, held, [held.module]));

  expect(field(one, "purl")).toContain("vcs_url=github");
  expect(field(firstOf(one, "hashes"), "alg")).toBe("SHA-512");
});

test("passes over an integrity it cannot read rather than failing the build", () => {
  const held = workspace(
    {},
    { name: "held", version: "2.0.0" },
    '    "held": ["held@2.0.0", "", {}, "sha512-tooshort"],',
  );

  expect(field(first(document({}, held, [held.module])), "hashes")).toBeUndefined();
});

test("says nothing extra for a package that came from the default registry", () => {
  const held = workspace(
    {},
    { name: "held", version: "2.0.0" },
    `    "held": ["held@2.0.0", "", {}, "${INTEGRITY}"],`,
  );

  expect(field(first(document({}, held, [held.module])), "purl")).toBe("pkg:npm/held@2.0.0");
});

test("carries an identity only where one was asked for", () => {
  const held = workspace();

  expect(field(document({ serialNumber: true }, held), "serialNumber")).toContain("urn:uuid:");
  expect(field(document({}, held), "serialNumber")).toBeUndefined();
  expect(field(document({ timestamp: true }, held), "metadata", "timestamp")).toBeDefined();
  expect(field(document({}, held), "metadata", "timestamp")).toBeUndefined();
});

test("names the supplier where one was given", () => {
  const stated = { supplier: { name: "Acme", url: ["https://acme.test"] } };

  expect(field(document(stated, workspace()), "metadata", "supplier", "name")).toBe("Acme");
});

test("writes one copy by default and every path it was given", () => {
  const held = workspace();
  const emitted: string[] = [];
  const bundling = {
    emitFile: (one: { fileName: string }) => void emitted.push(one.fileName),
    getModuleIds: () => [],
    getModuleInfo: () => ({ importedIds: [] }),
  } as unknown as Bundling;

  const run = (paths?: readonly string[]): void => {
    const one = sbom(paths === undefined ? {} : { paths }) as unknown as {
      configResolved: (config: { root: string }) => void;
      generateBundle: (this: Bundling) => void;
    };

    one.configResolved({ root: held.at });
    one.generateBundle.call(bundling);
  };

  run();
  expect(emitted).toEqual(["cyclonedx/bom.json"]);

  emitted.length = 0;
  run(["a.json", "b.json"]);
  expect(emitted).toEqual(["a.json", "b.json"]);
});

test("records the tools the package declares it is built with", () => {
  const held = workspace({ devDependencies: { held: "1" } }, { name: "held", version: "2.0.0" });
  const tools = field(document({}, held), "metadata", "tools", "components");
  const named = Array.isArray(tools) ? tools.map((one: unknown) => field(one, "name")) : [];

  expect(named).toContain("held");
});

test("passes over a declared tool that is not installed", () => {
  const held = workspace({ devDependencies: { nowhere: "1" } });
  const tools = field(document({}, held), "metadata", "tools", "components");
  const named = Array.isArray(tools) ? tools.map((one: unknown) => field(one, "name")) : [];

  expect(named).not.toContain("nowhere");
});

test("draws an edge between two packages the build reached", () => {
  const root = mkdtempSync(join(tmpdir(), "stealth-sbom-"));
  const at = join(root, "packages", "one");
  const paths = ["held", "deeper"].map((named) => join(root, "node_modules", named));

  mkdirSync(at, { recursive: true });
  writeFileSync(join(at, "package.json"), JSON.stringify({ name: "@acme/one" }));
  writeFileSync(join(root, "bun.lock"), '{\n  "packages": {\n  },\n}\n');

  for (const [index, one] of paths.entries()) {
    mkdirSync(one, { recursive: true });
    writeFileSync(
      join(one, "package.json"),
      JSON.stringify({ name: index === 0 ? "held" : "deeper", version: "1.0.0" }),
    );
    writeFileSync(join(one, "index.js"), "");
  }

  const modules = paths.map((one) => join(one, "index.js"));
  const held = JSON.parse(
    written({}, building(modules, { [modules[0] ?? ""]: [modules[1] ?? ""] }), at),
  ) as unknown;
  const edges = field(held, "dependencies");
  const drawn = Array.isArray(edges)
    ? edges.filter((one: unknown) => field(one, "dependsOn") !== undefined)
    : [];

  expect(drawn).toHaveLength(1);
  expect(field(drawn[0], "ref")).toBe("pkg:npm/held@1.0.0");
});

test("reads a licence the manifest declares, beside the text beneath it", () => {
  const held = workspace({}, { license: "MIT", name: "held", version: "2.0.0" });
  const one = firstOf(first(document({}, held, [held.module])), "licenses");

  expect(field(one, "license", "id")).toBe("MIT");
});

test("reads a compound licence as the expression it is, rather than as a name", () => {
  const held = workspace({}, { license: "(MIT OR Apache-2.0)", name: "held", version: "2.0.0" });
  const one = firstOf(first(document({}, held, [held.module])), "licenses");

  expect(field(one, "expression")).toBe("(MIT OR Apache-2.0)");
});

test("writes a document even where the package being described has no manifest", () => {
  const root = mkdtempSync(join(tmpdir(), "stealth-sbom-"));
  const held = JSON.parse(written({}, building(), root)) as unknown;

  expect(field(held, "metadata", "component")).toBeUndefined();
  expect(field(held, "bomFormat")).toBe("CycloneDX");
});

test("names a package that states no version, which a purl allows", () => {
  const held = workspace({}, { name: "held" });

  expect(field(first(document({}, held, [held.module])), "purl")).toBe("pkg:npm/held");
});

test("reads where a package came from where the manager wrote it into the package", () => {
  const held = workspace(
    {},
    {
      _resolved: "https://npm.acme.test/held/-/held-2.0.0.tgz",
      name: "held",
      version: "2.0.0",
    },
  );

  expect(field(first(document({}, held, [held.module])), "purl")).toContain("repository_url=");
});

test("passes over a package the builder will not describe, and any edge to it", () => {
  const root = mkdtempSync(join(tmpdir(), "stealth-sbom-"));
  const at = join(root, "packages", "one");
  const paths = ["held", "nameless"].map((named) => join(root, "node_modules", named));

  mkdirSync(at, { recursive: true });
  writeFileSync(join(at, "package.json"), JSON.stringify({ name: "@acme/one" }));
  writeFileSync(join(root, "bun.lock"), '{\n  "packages": {\n  },\n}\n');

  for (const [index, one] of paths.entries()) {
    mkdirSync(one, { recursive: true });
    writeFileSync(
      join(one, "package.json"),
      JSON.stringify({ name: index === 0 ? "held" : "", version: "1.0.0" }),
    );
    writeFileSync(join(one, "index.js"), "");
  }

  const modules = paths.map((one) => join(one, "index.js"));
  const held = JSON.parse(
    written({}, building(modules, { [modules[0] ?? ""]: [modules[1] ?? ""] }), at),
  ) as unknown;
  const components = field(held, "components");

  expect(Array.isArray(components) ? components.length : 0).toBe(1);
  expect(field(first(held), "dependencies")).toBeUndefined();
});

test("reads the tarball a registry install recorded, where that is the only record", () => {
  const held = workspace(
    {},
    {
      dist: { tarball: "https://npm.acme.test/held/-/held-2.0.0.tgz" },
      name: "held",
      version: "2.0.0",
    },
  );

  expect(field(first(document({}, held, [held.module])), "purl")).toContain("repository_url=");
});
