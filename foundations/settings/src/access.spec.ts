import { describe, expect, it } from "vitest";

import { clearSetting, readSetting, writeSetting } from "#access.ts";
import { defineSetting, type SettingDefinition } from "#define.ts";
import { memoryStore } from "#stores/memory.ts";

function probe(
  initial: Readonly<Record<string, string>> = {},
): SettingDefinition<"dark" | "light" | "system"> {
  return defineSetting({
    fallback: "system",
    name: "color-mode",
    store: memoryStore(initial),
    values: ["light", "dark"],
  });
}

describe("readSetting", () => {
  it("returns the fallback where nothing was written", () => {
    expect(readSetting("docs", probe())).toBe("system");
  });

  it("returns the value that was written", () => {
    expect(readSetting("docs", probe({ "stealth.docs.color-mode": "dark" }))).toBe("dark");
  });

  it("returns the fallback where what was written is not one of the values", () => {
    expect(readSetting("docs", probe({ "stealth.docs.color-mode": "chartreuse" }))).toBe("system");
  });

  it("reads nothing another application wrote", () => {
    expect(readSetting("docs", probe({ "stealth.console.color-mode": "dark" }))).toBe("system");
  });
});

describe("writeSetting", () => {
  it("writes a value the next read returns", () => {
    const setting = probe();

    writeSetting("docs", setting, "dark");

    expect(readSetting("docs", setting)).toBe("dark");
  });

  it("writes under the application's own key", () => {
    const setting = probe();

    writeSetting("docs", setting, "dark");

    expect(setting.store.read("stealth.docs.color-mode")).toBe("dark");
  });
});

describe("clearSetting", () => {
  it("leaves the next read returning the fallback", () => {
    const setting = probe({ "stealth.docs.color-mode": "dark" });

    clearSetting("docs", setting);

    expect(readSetting("docs", setting)).toBe("system");
  });
});
