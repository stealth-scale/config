import { type CustomTypeOptions } from "i18next";
import { describe, expect, expectTypeOf, it } from "vitest";

import { SMALL } from "#catalogues.fixtures.ts";
import { createI18n } from "#create-i18n.ts";
import { type Resources } from "#resources.ts";

describe("Resources", () => {
  it("sets defaultNS to false", () => {
    expectTypeOf<CustomTypeOptions["defaultNS"]>().toEqualTypeOf<false>();

    expect(createI18n({ catalogues: SMALL, locale: "en" }).options.defaultNS).toBe(false);
  });

  it("sets returnNull to false", () => {
    expectTypeOf<CustomTypeOptions["returnNull"]>().toEqualTypeOf<false>();

    const i18n = createI18n({ catalogues: SMALL, locale: "en" });

    expect(i18n.options.returnNull).toBe(false);
    expect(i18n.t("overlays:absent")).toBe("absent");
  });

  it("supplies the resources type i18next reads", () => {
    expectTypeOf<CustomTypeOptions["resources"]>().toEqualTypeOf<Resources>();

    expect(createI18n({ catalogues: SMALL, locale: "en" }).options.ns).toStrictEqual([
      "overlays",
      "site",
    ]);
  });

  it("declares no namespace of its own", () => {
    expectTypeOf<keyof Resources>().toEqualTypeOf<never>();

    const empty: Resources = {};

    expect(Object.keys(empty)).toStrictEqual([]);
  });
});
