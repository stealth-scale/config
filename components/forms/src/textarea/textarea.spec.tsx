import { type ReactElement, useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#textarea/recipe.ts";
import { Textarea, type TextareaProps } from "#textarea/textarea.tsx";

/**
 * Draws a textarea a caller drives, so a case can read what a driven one does.
 *
 * @returns The box, holding whatever the last change reported.
 */
function Driven(): ReactElement {
  const [held, setHeld] = useState("");

  return <Textarea aria-label="Notes" onValueChange={setHeld} value={held} />;
}

describe("Textarea", () => {
  it("breaks no accessibility rule where a caller names it", async () => {
    await expect(
      accessibilityViolations(Textarea, { props: { "aria-label": "Notes" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(
        recipe,
        (props: TextareaProps) => render(<Textarea aria-label="Notes" {...props} />).container,
        { slot: "root" },
      ),
    ).toStrictEqual([]);
  });

  it("draws a textarea inside the box that measures it", () => {
    const { container } = render(<Textarea aria-label="Notes" />);

    expect(slotElement(container, "textarea", "control").tagName).toBe("TEXTAREA");
  });

  it("is three lines tall before it grows", () => {
    render(<Textarea aria-label="Notes" />);

    expect(screen.getByRole("textbox").getAttribute("rows")).toBe("3");
  });

  it("copies the text onto the box that measures it", () => {
    const { container } = render(<Textarea aria-label="Notes" defaultValue="two lines" grows />);

    expect(slotElement(container, "textarea", "root").dataset["value"]).toBe("two lines");
  });

  it("copies the text again as a person types", () => {
    const { container } = render(<Textarea aria-label="Notes" grows />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "a line" } });

    expect(slotElement(container, "textarea", "root").dataset["value"]).toBe("a line");
  });

  it("tells a caller what it holds as a person types", () => {
    const told = vi.fn<(value: string) => void>();

    render(<Textarea aria-label="Notes" onValueChange={told} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "ab" } });

    expect(told).toHaveBeenLastCalledWith("ab");
  });

  it("follows a caller that drives it", () => {
    render(<Driven />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "abc" } });

    expect(screen.getByRole("textbox")).toHaveProperty("value", "abc");
  });
});
