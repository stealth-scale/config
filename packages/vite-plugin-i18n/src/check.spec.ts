import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { type ScratchFiles, withScratchWorkspace } from "@stealthscale/testing";

import { problems } from "#check.ts";
import { indexed } from "#emit.ts";
import { APP, WORKSPACE } from "#find.fixtures.ts";
import { found } from "#find.ts";

/**
 * Checks the fixture workspace with some files changed or added.
 *
 * @param changes - Files laid over the fixture.
 * @returns Each problem as `key says`, without the file.
 */
function checked(changes: ScratchFiles = {}): readonly string[] {
  return withScratchWorkspace({ ...WORKSPACE, ...changes }, (scratch) =>
    problems(indexed(found(join(scratch.root, APP))), "en").map(({ key, says }) =>
      `${key} ${says}`.trim(),
    ),
  );
}

describe("problems", () => {
  it("returns an empty array when every catalogue matches the fallback", () => {
    expect(checked()).toStrictEqual([]);
  });

  it("reports an override key the fallback does not define", () => {
    expect(checked({ [`${APP}/locales/en/overlays.json`]: '{"comands":"Actions"}' })).toStrictEqual(
      ["comands names a key the fallback does not define"],
    );
  });

  it("reports a placeholder an override drops", () => {
    expect(
      checked({ [`${APP}/locales/en/overlays.json`]: '{"nested":{"close":"Shut"}}' }),
    ).toStrictEqual(["nested.close leaves out the placeholder {{what}}"]);
  });

  it("accepts a key one package adds to another package's namespace", () => {
    expect(
      checked({
        [`${APP}/node_modules/@house/overlays/locales/en/hooks.json`]:
          '{"hurry":"Hurry","wait":"Hold on"}',
      }),
    ).toStrictEqual([]);
  });

  it("reports a key one owner states in two files", () => {
    expect(
      checked({
        [`${APP}/locales/en/site.json`]:
          '{"legal":{"terms":"Terms"},"welcome":"Welcome to {{name}}"}',
      }),
    ).toStrictEqual([
      expect.stringMatching(/^legal\.terms is also declared in .*\/locales\/en\/site\.json$/u),
    ]);
  });

  it("accepts a translation nested under a directory", () => {
    expect(
      checked({ [`${APP}/locales/nl/site/legal.yaml`]: "terms: Voorwaarden\n" }),
    ).toStrictEqual([]);
  });

  it("reports a key a nested translation adds", () => {
    expect(checked({ [`${APP}/locales/nl/site/legal.yaml`]: "term: Voorwaarde\n" })).toStrictEqual([
      "legal.term names a key the fallback does not define",
    ]);
  });

  it("reports a translated key the fallback does not define", () => {
    expect(
      checked({ [`${APP}/locales/nl/overlays.json`]: '{"nested":{"open":"Open"}}' }),
    ).toStrictEqual(["nested.open names a key the fallback does not define"]);
  });

  it("reports a placeholder a translation drops", () => {
    expect(checked({ [`${APP}/locales/nl/site.json`]: '{"welcome":"Welkom"}' })).toStrictEqual([
      "welcome leaves out the placeholder {{name}}",
    ]);
  });

  it("accepts a plural form against another form of the key", () => {
    expect(
      checked({
        [`${APP}/locales/nl/controls.json`]:
          '{"pages_one":"{{count}} pagina","pages_other":"{{count}} pagina\'s"}',
      }),
    ).toStrictEqual([]);
  });

  it("accepts a plural form that omits count", () => {
    expect(
      checked({
        [`${APP}/locales/nl/controls.json`]:
          '{"pages_one":"één pagina","pages_other":"{{count}} pagina\'s"}',
      }),
    ).toStrictEqual([]);
  });

  it("reports another placeholder a plural form drops", () => {
    expect(
      checked({
        [`${APP}/locales/en/site.json`]:
          '{"welcome_one":"Welcome, {{name}}","welcome_other":"Welcome, all {{count}} of you, {{name}}"}',
        [`${APP}/locales/nl/site.json`]: '{"welcome_one":"Welkom"}',
      }),
    ).toStrictEqual(["welcome_one leaves out the placeholder {{name}}"]);
  });

  it("accepts a plural form the fallback states under one suffix", () => {
    expect(
      checked({
        [`${APP}/locales/nl/controls.json`]: '{"pages_few":"{{count}} pagina\'s"}',
        [`${APP}/node_modules/@house/controls/locales/en/controls.json`]:
          '{"pages_one":"{{count}} page"}',
      }),
    ).toStrictEqual([]);
  });

  it("reports a namespace the fallback does not define", () => {
    expect(checked({ [`${APP}/locales/nl/extra.json`]: '{"x":"y"}' })).toStrictEqual([
      "names a namespace the en catalogues do not define",
    ]);
  });

  it("returns an empty array when the fallback language has no catalogue", () => {
    expect.hasAssertions();

    withScratchWorkspace(
      { "app/locales/nl/app.json": '{"x":"y"}', "app/package.json": '{"name":"app"}' },
      (scratch) => {
        expect(problems(indexed(found(join(scratch.root, "app"))), "en")).toStrictEqual([]);
      },
    );
  });
});
