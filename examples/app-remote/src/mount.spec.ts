import { expect, test } from "vite-plus/test";

import { mount } from "#mount.ts";

test("draws into the element the host handed it and nowhere else", async () => {
  const into = document.createElement("div");

  document.body.append(into);
  mount(into, 7);
  await new Promise((settle) => {
    setTimeout(settle, 0);
  });

  expect(into.textContent).toContain("7 open");
});

test("answers the root, so the host can take the application off its page again", async () => {
  const into = document.createElement("div");

  document.body.append(into);

  const root = mount(into, 1);

  await new Promise((settle) => {
    setTimeout(settle, 0);
  });
  root.unmount();

  expect(into.textContent).toBe("");
});
