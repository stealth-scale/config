import { type ReactElement } from "react";

import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { memoryStore, settingKey, type SettingStore } from "@stealthscale/settings";

import { useLocale } from "#context.ts";
import { LocaleProvider, type LocaleProviderProps } from "#provider.tsx";
import { LOCALE_SETTING } from "#setting.ts";

/**
 * Names the locale in force, its direction, and offers a switch to each other locale.
 *
 * @returns A paragraph and one button per locale.
 */
function Switcher(): ReactElement {
  const { direction, locale, locales, setLocale } = useLocale();

  return (
    <div>
      <p>{`${locale}/${direction}`}</p>
      {locales.map((one) => (
        <button
          key={one}
          onClick={() => {
            setLocale(one);
          }}
          type="button"
        >
          {one}
        </button>
      ))}
      <button
        onClick={() => {
          setLocale("ja");
        }}
        type="button"
      >
        {"ja"}
      </button>
    </div>
  );
}

/**
 * Mounts the switcher under a provider.
 *
 * @param props - What the provider is given beyond the application and a fresh store.
 * @returns The store the choice was kept in.
 */
function mounted(props: Partial<LocaleProviderProps> = {}): SettingStore {
  const store = props.store ?? memoryStore();

  render(
    <LocaleProvider app="probe" locales={["en", "nl"]} store={store} {...props}>
      <Switcher />
    </LocaleProvider>,
  );

  return store;
}

afterEach(() => {
  vi.unstubAllGlobals();
  document.documentElement.removeAttribute("lang");
  document.documentElement.removeAttribute("dir");
});

describe("LocaleProvider", () => {
  it("reads in the best offer for what the browser asks for", () => {
    vi.stubGlobal("navigator", { languages: ["nl-BE"] });
    mounted();

    expect(screen.getByText("nl/ltr")).toBeTruthy();
  });

  it("reads in the first offer where the browser asks for nothing it has", () => {
    vi.stubGlobal("navigator", { languages: ["ja"] });
    mounted();

    expect(screen.getByText("en/ltr")).toBeTruthy();
  });

  it("writes the locale onto the document root", () => {
    vi.stubGlobal("navigator", { languages: ["nl"] });
    mounted();

    expect(document.documentElement.lang).toBe("nl");
  });

  it("writes the direction of a right-to-left locale onto the document root", () => {
    mounted({ locales: ["ar-EG"] });

    expect(document.documentElement.dir).toBe("rtl");
    expect(screen.getByText("ar-EG/rtl")).toBeTruthy();
  });

  it("changes the locale when a person chooses another", () => {
    vi.stubGlobal("navigator", { languages: ["en"] });
    mounted();

    act(() => {
      screen.getByRole("button", { name: "nl" }).click();
    });

    expect(screen.getByText("nl/ltr")).toBeTruthy();
  });

  it("remembers the choice in the store", () => {
    vi.stubGlobal("navigator", { languages: ["en"] });

    const store = mounted();

    act(() => {
      screen.getByRole("button", { name: "nl" }).click();
    });

    expect(store.read(settingKey("probe", LOCALE_SETTING))).toBe("nl");
  });

  it("ignores a locale the application does not offer", () => {
    vi.stubGlobal("navigator", { languages: ["en"] });
    mounted();

    act(() => {
      screen.getByRole("button", { name: "ja" }).click();
    });

    expect(screen.getByText("en/ltr")).toBeTruthy();
  });

  it("reads in the locale it is driven with", () => {
    mounted({ locale: "nl" });

    expect(screen.getByText("nl/ltr")).toBeTruthy();
  });

  it("passes a choice up rather than remembering it when it is driven", () => {
    const heard: string[] = [];
    const store = mounted({
      locale: "en",
      onLocaleChange: (next) => {
        heard.push(next);
      },
    });

    act(() => {
      screen.getByRole("button", { name: "nl" }).click();
    });

    expect(heard).toStrictEqual(["nl"]);
    expect(store.read(settingKey("probe", LOCALE_SETTING))).toBeNull();
  });

  it("reports that a change is under way when it is told one is", () => {
    render(
      <LocaleProvider app="probe" isPending locale="en" locales={["en", "nl"]}>
        <Pending />
      </LocaleProvider>,
    );

    expect(screen.getByText("pending")).toBeTruthy();
  });
});

/**
 * Reports whether a change of locale is under way.
 *
 * @returns A paragraph saying so.
 */
function Pending(): ReactElement {
  return <p>{useLocale().isPending ? "pending" : "settled"}</p>;
}
