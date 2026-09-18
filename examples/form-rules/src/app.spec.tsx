import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "#app.tsx";

describe("App", () => {
  it("draws the form with no account kind chosen", () => {
    const { getByLabelText } = render(<App />);

    expect(getByLabelText("Account")).toHaveProperty("value", "");
  });

  it("welcomes the person once every rule passes", async () => {
    const { getByLabelText, getByRole } = render(<App />);

    fireEvent.change(getByLabelText("Account"), { target: { value: "individual" } });
    fireEvent.change(getByLabelText("Username"), { target: { value: "ann" } });
    fireEvent.change(getByLabelText("Password"), { target: { value: "hunter22hunter" } });
    fireEvent.change(getByLabelText("Password again"), { target: { value: "hunter22hunter" } });
    fireEvent.click(getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(getByRole("status").textContent).toBe("Welcome, ann");
    });
  });
});
