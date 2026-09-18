import { type ThirdPartyModule } from "i18next";
import { describe, expect, it } from "vitest";

import { EAGER, SMALL } from "#catalogues.fixtures.ts";
import { NONE } from "#catalogues.ts";
import { applied, type Changed, CHANGED, createI18n, heard } from "#create-i18n.ts";

describe("createI18n", () => {
  it("returns the fallback words without a fetch", () => {
    const i18n = createI18n({ catalogues: SMALL, locale: "en" });

    expect(i18n.t("overlays:commands")).toBe("Commands");
    expect(i18n.t("overlays:nested.close", { what: "the menu" })).toBe("Close the menu");
  });

  it("selects the plural form for count", () => {
    const i18n = createI18n({ catalogues: SMALL, locale: "en" });

    expect(i18n.t("overlays:pages", { count: 1 })).toBe("1 page");
    expect(i18n.t("overlays:pages", { count: 4 })).toBe("4 pages");
  });

  it("fetches a namespace in another language on first read", async () => {
    const i18n = createI18n({ catalogues: SMALL, locale: "nl" });

    await i18n.loadNamespaces(["overlays", "site"]);

    expect(i18n.t("overlays:commands")).toBe("Opdrachten");
  });

  it("falls back to the fallback language per key", async () => {
    const i18n = createI18n({ catalogues: SMALL, locale: "nl" });

    await i18n.loadNamespaces(["overlays", "site"]);

    expect(i18n.t("overlays:menu")).toBe("Menu");
    expect(i18n.t("site:welcome", { name: "Acme" })).toBe("Welcome to Acme");
  });

  it("returns every language when the catalogues are eager", () => {
    const i18n = createI18n({ catalogues: EAGER, locale: "nl" });

    expect(i18n.t("overlays:commands")).toBe("Opdrachten");
    expect(i18n.t("overlays:menu")).toBe("Menu");
  });

  it("falls back from a regional tag to its language", async () => {
    const i18n = createI18n({ catalogues: SMALL, locale: "nl-BE" });

    await i18n.loadNamespaces("overlays");

    expect(i18n.t("overlays:commands")).toBe("Opdrachten");
  });

  it("returns the key when no catalogue defines it", () => {
    expect(createI18n({ catalogues: NONE, locale: "en" }).t("overlays:commands")).toBe("commands");
  });

  it("merges an object option member by member", () => {
    const i18n = createI18n({
      catalogues: SMALL,
      locale: "en",
      options: { interpolation: { prefix: "${", suffix: "}" }, returnEmptyString: false },
    });

    expect(i18n.options.interpolation?.escapeValue).toBe(false);
    expect(i18n.options.interpolation?.prefix).toBe("${");
    expect(i18n.options.returnEmptyString).toBe(false);
    expect(i18n.options.returnNull).toBe(false);
  });

  it("keeps ns from the catalogues when options set it", () => {
    const i18n = createI18n({
      catalogues: SMALL,
      locale: "en",
      options: {
        lng: "fr",
        ns: ["elsewhere"],
        resources: { en: { site: { welcome: "Elsewhere" } } },
      },
    });

    expect(i18n.language).toBe("en");
    expect(i18n.options.ns).toStrictEqual(["overlays", "site"]);
    expect(i18n.t("site:welcome", { name: "Acme" })).toBe("Welcome to Acme");
  });

  it("calls a plugin before configure", () => {
    const seen: string[] = [];
    const plugin: ThirdPartyModule = {
      init: () => {
        seen.push("plugin");
      },
      type: "3rdParty",
    };

    createI18n({
      catalogues: SMALL,
      configure: (instance) => {
        seen.push(instance.isInitialized ? "configured, initialised" : "configured too early");
      },
      locale: "en",
      plugins: [plugin],
    });

    expect(seen).toStrictEqual(["plugin", "configured, initialised"]);
  });

  it("calls configure after init", () => {
    const i18n = createI18n({
      catalogues: SMALL,
      configure: (instance) => {
        instance.services.formatter?.add("shout", (value: unknown) => String(value).toUpperCase());
      },
      locale: "en",
    });

    expect(i18n.t("site:shouted", { name: "acme" })).toBe("ACME");
  });
});

describe("heard", () => {
  it("applies a changed pair sent on the channel", () => {
    const i18n = createI18n({ catalogues: SMALL, locale: "en" });
    const listeners: Array<(changed: Changed) => void> = [];
    const events: string[] = [];

    heard(i18n, {
      on: (event, listen) => {
        events.push(event);
        listeners.push(listen);
      },
    });

    for (const listen of listeners) {
      listen({ language: "en", namespace: "overlays", words: { menu: "Main menu" } });
    }

    expect(events).toStrictEqual([CHANGED]);
    expect(i18n.t("overlays:menu")).toBe("Main menu");
  });

  it("does nothing when no channel is given", () => {
    const i18n = createI18n({ catalogues: SMALL, locale: "en" });

    heard(i18n);

    expect(i18n.t("overlays:menu")).toBe("Menu");
  });
});

describe("applied", () => {
  it("replaces a word the new pair states", () => {
    const i18n = createI18n({ catalogues: SMALL, locale: "en" });

    applied(i18n, {
      language: "en",
      namespace: "overlays",
      words: { commands: "Actions", nested: { close: "Shut {{what}}" } },
    });

    expect(i18n.t("overlays:commands")).toBe("Actions");
    expect(i18n.t("overlays:nested.close", { what: "it" })).toBe("Shut it");
  });

  it("removes a word the new pair omits", () => {
    const i18n = createI18n({ catalogues: SMALL, locale: "en" });

    applied(i18n, { language: "en", namespace: "overlays", words: { commands: "Actions" } });

    expect(i18n.t("overlays:menu")).toBe("menu");
  });
});
