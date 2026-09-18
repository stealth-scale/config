import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { memoryStore } from "@stealthscale/settings";

import { App } from "#app.tsx";
import { resetProfiles } from "#records.ts";

describe("App", () => {
  it("draws the form for the first profile", () => {
    resetProfiles();

    const { getByLabelText } = render(<App store={memoryStore()} />);

    expect(getByLabelText("Name")).toHaveProperty("value", "Roy");
  });

  it("says so where there is no profile to edit", () => {
    const { getByRole } = render(<App id="p-9" store={memoryStore()} />);

    expect(getByRole("alert").textContent).toBe("There is no profile to edit");
  });

  it("reports the save", async () => {
    resetProfiles();

    const { getByRole } = render(<App store={memoryStore()} />);

    fireEvent.click(getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(getByRole("button", { name: "Save" })).toBeDefined();
    });

    fireEvent.click(getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(getByRole("status").textContent).toBe("Saved Roy");
    });
  });
});
