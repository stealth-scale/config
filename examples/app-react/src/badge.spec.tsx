import { act } from "react";
import { createRoot } from "react-dom/client";

import { expect, test } from "vite-plus/test";

import { Badge } from "#badge.tsx";

test("renders what the package knows about itself", () => {
  const host = document.createElement("div");

  document.body.append(host);
  act(() => {
    createRoot(host).render(<Badge />);
  });

  expect(host.textContent).toBe("@stealthscale/example-app-react 2.1.0");
});
