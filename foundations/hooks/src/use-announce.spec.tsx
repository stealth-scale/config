import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type AnnouncePoliteness, speakable, useAnnounce } from "#use-announce.ts";

function regionFor(politeness: AnnouncePoliteness): HTMLElement {
  const found = document.querySelector<HTMLElement>(`[aria-live="${politeness}"]`);

  if (found === null) throw new Error(`no ${politeness} region on the page`);

  return found;
}

async function settle(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      globalThis.requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

describe("useAnnounce", () => {
  it("writes the message into the polite region", async () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current("5 results");
    });
    await settle();

    expect(regionFor("polite").textContent).toBe("5 results");
  });

  it("writes an assertive message into the assertive region", async () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current("Could not save", "assertive");
    });
    await settle();

    expect(regionFor("assertive").textContent).toBe("Could not save");
  });

  it("marks the polite region as a status", () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current("queued");
    });

    expect(regionFor("polite").getAttribute("role")).toBe("status");
  });

  it("marks the assertive region as an alert", () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current("failed", "assertive");
    });

    expect(regionFor("assertive").getAttribute("role")).toBe("alert");
  });

  it("reads the whole region rather than the words that changed", () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current("13 results");
    });

    expect(regionFor("polite").getAttribute("aria-atomic")).toBe("true");
  });

  it("empties the region so the same message is said again", () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current("copied");
    });

    expect(regionFor("polite").textContent).toBe("");
  });

  it("replaces an earlier message from the same caller", async () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current("1 done");
      result.current("17 done");
    });
    await settle();

    expect(regionFor("polite").textContent).toBe("17 done");
  });

  it("reads both messages when two callers announce in one frame", async () => {
    const first = renderHook(() => useAnnounce());
    const second = renderHook(() => useAnnounce());

    act(() => {
      first.result.current("Saved");
      second.result.current("3 rows selected");
    });
    await settle();

    expect(regionFor("polite").textContent).toBe("Saved. 3 rows selected");
  });

  it("writes nothing for an empty message", async () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current("first");
    });
    await settle();
    act(() => {
      result.current("");
    });
    await settle();

    expect(regionFor("polite").textContent).toBe("first");
  });

  it("keeps one function for the life of the component", () => {
    const { rerender, result } = renderHook(() => useAnnounce());
    const held = result.current;

    rerender();

    expect(result.current).toBe(held);
  });
});

describe("speakable", () => {
  it("returns an empty string for no messages", () => {
    expect(speakable([])).toBe("");
  });

  it("returns the message alone when there is one", () => {
    expect(speakable(["Saved"])).toBe("Saved");
  });

  it("adds a full stop between two messages", () => {
    expect(speakable(["Saved", "3 rows"])).toBe("Saved. 3 rows");
  });

  it("adds no full stop after a message that ends in one", () => {
    expect(speakable(["Saved.", "3 rows"])).toBe("Saved. 3 rows");
  });

  it("adds no full stop after a message that ends in an exclamation mark", () => {
    expect(speakable(["Saved!", "3 rows"])).toBe("Saved! 3 rows");
  });

  it("adds no full stop after a message that ends in a question mark", () => {
    expect(speakable(["Saved?", "3 rows"])).toBe("Saved? 3 rows");
  });

  it("says a repeated message once", () => {
    expect(speakable(["Saved", "3 rows", "Saved"])).toBe("Saved. 3 rows");
  });
});
