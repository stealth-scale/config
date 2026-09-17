import { type ReactElement, useState } from "react";

import * as library from "@tanstack/react-hotkeys";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as published from "#tanstack.ts";

const { formatForDisplay, HotkeysProvider, useHotkey } = published;

/**
 * Counts how often its shortcut fires, and shows the shortcut the way Windows writes it.
 */
function Counter(): ReactElement {
  const [fired, setFired] = useState(0);

  useHotkey(
    "Mod+K",
    () => {
      setFired((count) => count + 1);
    },
    { platform: "windows" },
  );

  return (
    <>
      <p>{formatForDisplay("Mod+K", { platform: "windows" })}</p>
      <output>{fired}</output>
    </>
  );
}

describe("tanstack", () => {
  it("publishes every name the library states", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(Object.keys(library).toSorted());
  });

  it("publishes more than sixty of them, which is why the list is not written out", () => {
    expect(Object.keys(published).length).toBeGreaterThan(60);
  });

  it("writes a binding the way the platform a person is on writes it", () => {
    expect(formatForDisplay("Mod+K", { platform: "windows" })).toBe("Ctrl+K");
    expect(formatForDisplay("Mod+K", { platform: "mac" })).toBe("⌘ K");
  });

  it("fires a shortcut on the keys it was registered for", () => {
    render(
      <HotkeysProvider>
        <Counter />
      </HotkeysProvider>,
    );

    fireEvent.keyDown(document, { code: "KeyK", ctrlKey: true, key: "k" });

    expect(screen.getByRole("status").textContent).toBe("1");
  });

  it("leaves a shortcut alone on keys it was not registered for", () => {
    render(
      <HotkeysProvider>
        <Counter />
      </HotkeysProvider>,
    );

    fireEvent.keyDown(document, { code: "KeyJ", ctrlKey: true, key: "j" });

    expect(screen.getByRole("status").textContent).toBe("0");
  });
});
