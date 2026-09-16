import { describe, expect, it } from "vitest";

import { mount } from "#mount.ts";

describe("mount", () => {
  it("renders into the element the host gave it and nowhere else", async () => {
    const into = document.createElement("div");

    document.body.append(into);
    mount(into, 7);
    await new Promise((settle) => {
      setTimeout(settle, 0);
    });

    expect(into.textContent).toContain("7 open");
  });

  it("returns the root", async () => {
    const into = document.createElement("div");

    document.body.append(into);

    const root = mount(into, 1);

    await new Promise((settle) => {
      setTimeout(settle, 0);
    });
    root.unmount();

    expect(into.textContent).toBe("");
  });
});
