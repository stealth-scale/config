import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";

import { APP, WORKSPACE } from "#find.fixtures.ts";
import { configured, updated } from "#plugin.fixtures.ts";
import { ID } from "#plugin.ts";

describe("i18n", () => {
  it("resolves the catalogues identifier with a prefix", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      expect(configured(scratch).resolveId(ID)).toBe(`\0${ID}`);
    });
  });

  it("returns undefined for an unrelated import", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);

      expect(plugin.resolveId("react")).toBeUndefined();
      expect(plugin.load("react")).toBeUndefined();
    });
  });

  it("loads the catalogues module", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      expect(configured(scratch).load(`\0${ID}`)).toContain('export const fallback = "en";');
    });
  });

  it("writes the types under src", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      configured(scratch);

      expect(scratch.read(`${APP}/src/i18n.gen.d.ts`)).toContain('"controls": {');
    });
  });

  it("omits a namespace the namespaces option rejects", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      configured(scratch, "serve", { namespaces: (namespace) => !namespace.endsWith(".demo") });

      expect(scratch.read(`${APP}/src/i18n.gen.d.ts`)).not.toContain("controls.demo");
    });
  });

  it("writes no types when types is false", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      configured(scratch, "serve", { types: false });

      expect(() => scratch.read(`${APP}/src/i18n.gen.d.ts`)).toThrow("ENOENT");
    });
  });

  it("adds every locales directory to the watcher", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const watched: string[] = [];

      configured(scratch).configureServer({
        watcher: {
          add: (paths) => {
            watched.push(...paths);
          },
        },
      });

      expect(watched.some((path) => path.endsWith("/@house/overlays/locales"))).toBe(true);
      expect(watched.some((path) => path.endsWith(`/${APP}/locales`))).toBe(true);
    });
  });

  it("returns undefined for a file outside locales", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      expect(
        updated(configured(scratch), join(scratch.root, APP, "src/main.tsx")).answered,
      ).toBeUndefined();
    });
  });

  it("returns undefined for a catalogue it did not find", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      expect(
        updated(configured(scratch), join(scratch.root, APP, "locales/en/unknown.json")).answered,
      ).toBeUndefined();
    });
  });

  it("warns on an invalid catalogue when serving", () => {
    expect.hasAssertions();

    withScratchWorkspace(
      { ...WORKSPACE, [`${APP}/locales/nl/site.json`]: '{"welcome":"Welkom"}' },
      (scratch) => {
        const warn = vi.fn();

        configured(scratch).buildStart.call({ warn });

        expect(warn).toHaveBeenCalledWith(
          expect.stringContaining("leaves out the placeholder {{name}}"),
        );
      },
    );
  });

  it("throws on an invalid catalogue when building", () => {
    expect.hasAssertions();

    withScratchWorkspace(
      { ...WORKSPACE, [`${APP}/locales/nl/site.json`]: '{"welcome":"Welkom"}' },
      (scratch) => {
        expect(() => {
          configured(scratch, "build").buildStart.call({ warn: vi.fn() });
        }).toThrow("leaves out the placeholder {{name}}");
      },
    );
  });

  it("reports the file when a namespace has no fallback catalogue", () => {
    expect.hasAssertions();

    withScratchWorkspace(
      { ...WORKSPACE, [`${APP}/locales/nl/extra.json`]: '{"x":"y"}' },
      (scratch) => {
        const warn = vi.fn();

        configured(scratch).buildStart.call({ warn });

        expect(warn).toHaveBeenCalledWith(
          expect.stringMatching(
            /locales\/nl\/extra\.json names a namespace the en catalogues do not define$/u,
          ),
        );
      },
    );
  });

  it("warns nothing when every catalogue is valid", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const warn = vi.fn();

      configured(scratch, "build").buildStart.call({ warn });

      expect(warn).not.toHaveBeenCalled();
    });
  });

  it("rewrites the types when a catalogue changes during a watching build", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch, "build");

      scratch.write({ [`${APP}/locales/en/site.json`]: '{"welcome":"Hello {{name}}"}' });
      plugin.watchChange(join(scratch.root, APP, "locales/en/site.json"));

      expect(scratch.read(`${APP}/src/i18n.gen.d.ts`)).toContain('"welcome": "Hello {{name}}"');
    });
  });

  it("ignores a file outside locales during a watching build", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch, "build");
      const before = scratch.read(`${APP}/src/i18n.gen.d.ts`);

      scratch.write({ [`${APP}/locales/en/site.json`]: '{"welcome":"Hello {{name}}"}' });
      plugin.watchChange(join(scratch.root, APP, "src/main.tsx"));

      expect(scratch.read(`${APP}/src/i18n.gen.d.ts`)).toBe(before);
    });
  });

  it("ignores a catalogue change when serving", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const before = scratch.read(`${APP}/src/i18n.gen.d.ts`);

      scratch.write({ [`${APP}/locales/en/site.json`]: '{"welcome":"Hello {{name}}"}' });
      plugin.watchChange(join(scratch.root, APP, "locales/en/site.json"));

      expect(scratch.read(`${APP}/src/i18n.gen.d.ts`)).toBe(before);
    });
  });
});
