import { type ReactElement } from "react";
import { renderToString } from "react-dom/server";

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { defineSetting, type SettingDefinition } from "#define.ts";
import { memoryStore } from "#stores/memory.ts";
import { useSetting } from "#use-setting.ts";

function probe(
  initial: Readonly<Record<string, string>> = {},
): SettingDefinition<"dark" | "light"> {
  return defineSetting({
    fallback: "light",
    name: "color-mode",
    store: memoryStore(initial),
    values: ["light", "dark"],
  });
}

describe("useSetting", () => {
  it("returns the fallback where nothing was written", () => {
    const { result } = renderHook(() => useSetting("docs", probe()));

    expect(result.current[0]).toBe("light");
  });

  it("returns the value that was written", () => {
    const setting = probe({ "stealth.docs.color-mode": "dark" });
    const { result } = renderHook(() => useSetting("docs", setting));

    expect(result.current[0]).toBe("dark");
  });

  it("returns the value its setter wrote", () => {
    const setting = probe();
    const { result } = renderHook(() => useSetting("docs", setting));

    act(() => {
      result.current[1]("dark");
    });

    expect(result.current[0]).toBe("dark");
  });

  it("writes the value into the store", () => {
    const setting = probe();
    const { result } = renderHook(() => useSetting("docs", setting));

    act(() => {
      result.current[1]("dark");
    });

    expect(setting.store.read("stealth.docs.color-mode")).toBe("dark");
  });

  it("follows a value another document wrote", () => {
    const setting = probe();
    const { result } = renderHook(() => useSetting("docs", setting));

    act(() => {
      setting.store.write("stealth.docs.color-mode", "dark");
    });

    expect(result.current[0]).toBe("dark");
  });

  it("returns the fallback again when the setting is cleared elsewhere", () => {
    const setting = probe({ "stealth.docs.color-mode": "dark" });
    const { result } = renderHook(() => useSetting("docs", setting));

    act(() => {
      setting.store.clear("stealth.docs.color-mode");
    });

    expect(result.current[0]).toBe("light");
  });

  it("gives two readers of one setting the same value", () => {
    const setting = probe();
    const first = renderHook(() => useSetting("docs", setting));
    const second = renderHook(() => useSetting("docs", setting));

    act(() => {
      first.result.current[1]("dark");
    });

    expect(second.result.current[0]).toBe("dark");
  });

  it("leaves a reader of another application alone", () => {
    const setting = probe();
    const mine = renderHook(() => useSetting("docs", setting));
    const theirs = renderHook(() => useSetting("console", setting));

    act(() => {
      mine.result.current[1]("dark");
    });

    expect(theirs.result.current[0]).toBe("light");
  });

  it("renders on a server from the store rather than from the fallback", () => {
    const setting = probe({ "stealth.docs.color-mode": "dark" });

    function Show(): ReactElement {
      const [mode] = useSetting("docs", setting);

      return <i>{mode}</i>;
    }

    expect(renderToString(<Show />)).toContain("dark");
  });

  it("follows a different setting when it is handed one", () => {
    const first = probe({ "stealth.docs.color-mode": "dark" });
    const second = probe();
    const { rerender, result } = renderHook(({ setting }) => useSetting("docs", setting), {
      initialProps: { setting: first },
    });

    rerender({ setting: second });

    expect(result.current[0]).toBe("light");
  });

  it("reads another application's value when it is handed another name", () => {
    const setting = probe({
      "stealth.console.color-mode": "dark",
      "stealth.docs.color-mode": "light",
    });
    const { rerender, result } = renderHook(({ app }) => useSetting(app, setting), {
      initialProps: { app: "docs" },
    });

    rerender({ app: "console" });

    expect(result.current[0]).toBe("dark");
  });

  it("stops listening when the component unmounts", () => {
    const setting = probe();
    const { result, unmount } = renderHook(() => useSetting("docs", setting));
    const held = result.current[0];

    unmount();
    setting.store.write("stealth.docs.color-mode", "dark");

    expect(held).toBe("light");
  });
});
