import { getI18n } from "react-i18next";
import { describe, expect, it, vi } from "vitest";

import { SMALL } from "#catalogues.fixtures.ts";

vi.mock(import("virtual:i18n"), () => ({ catalogues: SMALL }));

describe("testing", () => {
  it("sets the global instance to the fallback language", async () => {
    await import("#testing.ts");

    const i18n = getI18n();

    expect(i18n.language).toBe("en");
    expect(i18n.t("overlays:commands")).toBe("Commands");
  });

  it("interpolates a value into a word", async () => {
    await import("#testing.ts");

    expect(getI18n().t("site:welcome", { name: "Probe" })).toBe("Welcome to Probe");
  });
});
