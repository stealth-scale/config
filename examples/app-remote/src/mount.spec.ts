import { act } from "react";

import { describe, expect, it } from "vitest";

import { mount } from "#mount.ts";

describe("mount", () => {
  it("renders into the element the host gave it and nowhere else", () => {
    const into = document.createElement("div");

    document.body.append(into);
    act(() => {
      mount(into, 7);
    });

    expect(into.textContent).toContain("7 open");
  });

  it("returns the root", async () => {
    const into = document.createElement("div");

    document.body.append(into);

    const root = await act(() => mount(into, 1));

    act(() => {
      root.unmount();
    });

    expect(into.textContent).toBe("");
  });
});
