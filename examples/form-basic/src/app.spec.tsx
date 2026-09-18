import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "#app.tsx";

describe("App", () => {
  it("reads every label and legend from the English catalogue", () => {
    const { getByLabelText, getByText } = render(<App />);

    expect(getByText("Who you are").tagName).toBe("LEGEND");
    expect(getByLabelText("Your name").getAttribute("name")).toBe("name");
    expect(getByText("We answer within a day").tagName).toBe("P");
    expect(getByText("Choose a topic")).toHaveProperty("value", "");
  });

  it("switches every word to Dutch and back", () => {
    const { getByLabelText, getByRole, getByText } = render(<App />);

    fireEvent.click(getByRole("button", { name: "Nederlands" }));

    expect(getByText("Wie u bent").tagName).toBe("LEGEND");
    expect(getByLabelText("Uw naam").getAttribute("name")).toBe("name");
    expect(getByRole("button", { name: "Versturen" })).toBeDefined();

    fireEvent.click(getByRole("button", { name: "English" }));

    expect(getByText("Who you are").tagName).toBe("LEGEND");
  });

  it("thanks the person by name once the form is sent", async () => {
    const { getByLabelText, getByRole } = render(<App />);

    fireEvent.change(getByLabelText("Your name"), { target: { value: "Roy" } });
    fireEvent.change(getByLabelText("Email address"), { target: { value: "roy@example.com" } });
    fireEvent.change(getByLabelText("Topic"), { target: { value: "sales" } });
    fireEvent.click(getByLabelText("I agree to be contacted"));
    fireEvent.click(getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(getByRole("status").textContent).toBe("Thanks Roy, we have your message");
    });
  });
});
