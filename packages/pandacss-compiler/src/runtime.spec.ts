import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { type Separator } from "@stealthscale/pandacss-naming";

import { rewriteRuntime } from "#runtime.ts";

const HELPERS = [
  "  const toClass = (paths, name) => {",
  '    return hash ? fmt(u.toHash(parts, toHash)) : parts.join(":")',
  "  }",
  "      set.add(name)",
  "",
].join("\n");

const RUNTIME = [
  "      transform(prop, value) {",
  '        return { className: value === "__ignore__" ? className : `${className}--${prop}-${withoutSpace(value)}` }',
  "      },",
  "  const formatClassName = (name) => {",
  "    const next = false ? toHash(name) : name",
  "    return classPrefix ? `${classPrefix}-${next}` : next",
  "  }",
  "",
].join("\n");

const SLOTS = [
  '"use client";',
  "        children: createElement(StyledComponent, {",
  "          ...resolvedProps,",
  "          'data-slot': slot,",
  "          ref,",
  "        }),",
  "      return createElement(StyledComponent, {",
  "        ...resolvedProps,",
  "        'data-slot': slot,",
  "        ref,",
  "      })",
  "",
].join("\n");

interface Files {
  helpers: string;
  runtime: string;
  slots?: string;
}

interface Rewritten {
  helpers: string;
  runtime: string;
  slots: string;
}

interface Run {
  extension?: string;
  jsx?: boolean;
  separator?: Separator;
  twice?: boolean;
}

function rewritten(files: Files, run: Run = {}): Rewritten {
  const dir = mkdtempSync(join(tmpdir(), "pandacss-compiler-"));
  const extension = run.extension ?? "mjs";
  const separator = run.separator ?? "_";
  const slots = join(dir, "jsx", `create-slot-recipe-context.${extension}`);

  try {
    mkdirSync(join(dir, "recipes"));
    writeFileSync(join(dir, `helpers.${extension}`), files.helpers);
    writeFileSync(join(dir, "recipes", `runtime.${extension}`), files.runtime);
    if (run.jsx !== false) {
      mkdirSync(join(dir, "jsx"));
      writeFileSync(slots, files.slots ?? SLOTS);
    }
    rewriteRuntime(dir, separator);
    if (run.twice === true) rewriteRuntime(dir, separator);

    return {
      helpers: readFileSync(join(dir, `helpers.${extension}`), "utf8"),
      runtime: readFileSync(join(dir, "recipes", `runtime.${extension}`), "utf8"),
      slots: run.jsx === false ? "" : readFileSync(slots, "utf8"),
    };
  } finally {
    rmSync(dir, { force: true, recursive: true });
  }
}

describe("rewriteRuntime", () => {
  it("passes the joined atomic class through the scheme with the separator", () => {
    const { helpers } = rewritten({ helpers: HELPERS, runtime: RUNTIME });

    expect(helpers).toContain('atomicClass(parts.join(":"), "_")');
  });

  it("writes the separator the compiler was configured with", () => {
    const { helpers, runtime } = rewritten(
      { helpers: HELPERS, runtime: RUNTIME },
      { separator: "-" },
    );

    expect(helpers).toContain('atomicClass(parts.join(":"), "-")');
    expect(runtime).toContain(
      'return atomicClass(classPrefix ? `${classPrefix}-${next}` : next, "-")',
    );
  });

  it("drops an empty class instead of adding it", () => {
    const { helpers } = rewritten({ helpers: HELPERS, runtime: RUNTIME });

    expect(helpers).toContain('if (name !== "") set.add(name)');
  });

  it("writes a variant class through the scheme", () => {
    const { runtime } = rewritten({ helpers: HELPERS, runtime: RUNTIME });

    expect(runtime).toContain("variantClass(className, prop, value)");
    expect(runtime).not.toContain("withoutSpace(value)");
  });

  it.each(["_", "="])("matches the variant line under the separator %s", (separator) => {
    const runtime = RUNTIME.replace("${prop}-${", `\${prop}${separator}\${`);

    expect(rewritten({ helpers: HELPERS, runtime }).runtime).toContain(
      "variantClass(className, prop, value)",
    );
  });

  it("writes a compound class through the scheme", () => {
    const { runtime } = rewritten({ helpers: HELPERS, runtime: RUNTIME });

    expect(runtime).toContain(
      'return atomicClass(classPrefix ? `${classPrefix}-${next}` : next, "_")',
    );
  });

  it("drops the slot attribute from the provider and from the part", () => {
    const { slots } = rewritten({ helpers: HELPERS, runtime: RUNTIME });

    expect(slots).not.toContain("data-slot");
    expect(slots).toContain("          ...resolvedProps,\n          ref,");
    expect(slots).toContain("        ...resolvedProps,\n        ref,");
  });

  it("imports what each file uses from the scheme at its top", () => {
    const { helpers, runtime } = rewritten({ helpers: HELPERS, runtime: RUNTIME });

    expect(
      helpers.startsWith('import { atomicClass } from "@stealthscale/pandacss-naming";\n'),
    ).toBe(true);
    expect(
      runtime.startsWith(
        'import { atomicClass, variantClass } from "@stealthscale/pandacss-naming";\n',
      ),
    ).toBe(true);
  });

  it("marks a file that imports nothing with a comment after its directive", () => {
    const { slots } = rewritten({ helpers: HELPERS, runtime: RUNTIME });

    expect(
      slots.startsWith('"use client";\n// rewritten by @stealthscale/pandacss-compiler\n'),
    ).toBe(true);
  });

  it("leaves a runtime with no jsx directory as it is beyond the two files it holds", () => {
    const { helpers, slots } = rewritten({ helpers: HELPERS, runtime: RUNTIME }, { jsx: false });

    expect(helpers).toContain('atomicClass(parts.join(":"), "_")');
    expect(slots).toBe("");
  });

  it("throws when the directory contains no runtime", () => {
    const dir = mkdtempSync(join(tmpdir(), "pandacss-compiler-"));

    try {
      expect(() => {
        rewriteRuntime(dir, "_");
      }).toThrow(/contains no generated runtime: neither helpers\.mjs nor helpers\.js$/u);
    } finally {
      rmSync(dir, { force: true, recursive: true });
    }
  });

  it("leaves a rewritten runtime as it is on a second run", () => {
    const once = rewritten({ helpers: HELPERS, runtime: RUNTIME });
    const twice = rewritten({ helpers: HELPERS, runtime: RUNTIME }, { twice: true });

    expect(twice).toStrictEqual(once);
  });

  it("reads the runtime under the js extension when there is no mjs", () => {
    const { helpers } = rewritten({ helpers: HELPERS, runtime: RUNTIME }, { extension: "js" });

    expect(helpers).toContain('atomicClass(parts.join(":"), "_")');
  });

  it("throws when a template line is absent", () => {
    expect(() => rewritten({ helpers: "export const nothing = 1\n", runtime: RUNTIME })).toThrow(
      /helpers\.mjs contains parts\.join\(":"\) 0 times where the rewrite needs it once/u,
    );
  });

  it("throws when a template line appears twice", () => {
    expect(() => rewritten({ helpers: HELPERS, runtime: `${RUNTIME}${RUNTIME}` })).toThrow(
      /runtime\.mjs contains .* 2 times where the rewrite needs it once/u,
    );
  });

  it("throws when the slot attribute line appears once where the rewrite needs it twice", () => {
    const slots = SLOTS.replace("          'data-slot': slot,\n", "");

    expect(() => rewritten({ helpers: HELPERS, runtime: RUNTIME, slots })).toThrow(
      /create-slot-recipe-context\.mjs contains 'data-slot': slot, 1 times where the rewrite needs it 2 times/u,
    );
  });
});
