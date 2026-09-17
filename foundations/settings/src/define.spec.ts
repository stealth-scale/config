import { describe, expect, it } from "vitest";

import { defineSetting, settingKey } from "#define.ts";
import { localStore } from "#stores/local.ts";
import { memoryStore } from "#stores/memory.ts";

describe("settingKey", () => {
  it("writes the application and the setting under one prefix", () => {
    expect(settingKey("docs", "color-mode")).toBe("stealth.docs.color-mode");
  });

  it("keeps two applications apart", () => {
    expect(settingKey("docs", "theme")).not.toBe(settingKey("console", "theme"));
  });
});

describe("defineSetting", () => {
  it("keeps the name it is given", () => {
    const setting = defineSetting({ fallback: "a", name: "probe", values: ["a", "b"] });

    expect(setting.name).toBe("probe");
  });

  it("keeps the fallback it is given", () => {
    const setting = defineSetting({ fallback: "a", name: "probe", values: ["a", "b"] });

    expect(setting.fallback).toBe("a");
  });

  it("holds the values as a set", () => {
    const setting = defineSetting({ fallback: "a", name: "probe", values: ["a", "b"] });

    expect([...setting.values]).toStrictEqual(["a", "b"]);
  });

  it("takes a fallback that is not one of the values", () => {
    const setting = defineSetting({ fallback: "system", name: "probe", values: ["light", "dark"] });

    expect(setting.values.has("system")).toBe(false);
  });

  it("keeps the store it is given", () => {
    const store = memoryStore();
    const setting = defineSetting({ fallback: "a", name: "probe", store, values: ["a"] });

    expect(setting.store).toBe(store);
  });

  it("keeps settings in local storage where it is given no store", () => {
    const setting = defineSetting({ fallback: "a", name: "probe", values: ["a"] });

    expect(setting.store).toBe(localStore());
  });
});
