import { act } from "react";
import { createRoot } from "react-dom/client";

import { describe, expect, test } from "vitest";

import { Badge } from "#badge.tsx";

describe("badge", () => {
  test("renders what the package knows about itself", () => {
    const host = document.createElement("div");

    document.body.append(host);
    act(() => {
      createRoot(host).render(<Badge />);
    });

    expect(host.textContent).toBe("@stealthscale/example-app-react 2.1.0");
  });
});
