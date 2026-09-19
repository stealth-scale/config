import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { useRevealed } from "#app-shell/revealed.ts";

/**
 * Draws the answer the hook holds, and a control that shows the sheet.
 *
 * @param props - Whether the shell is too narrow to hold the panel beside the page.
 * @returns What the hook answers, and the control that sets it.
 */
function Reader({ narrow }: { readonly narrow: boolean }): ReactElement {
  const [shown, setOpen] = useRevealed(narrow);

  return (
    <button
      onClick={() => {
        setOpen(true);
      }}
      type="button"
    >
      {shown ? "shown" : "hidden"}
    </button>
  );
}

describe("useRevealed", () => {
  it("starts hidden", () => {
    render(<Reader narrow />);

    expect(screen.getByRole("button").textContent).toBe("hidden");
  });

  it("shows the sheet when something asks for it", async () => {
    render(<Reader narrow />);

    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toBe("shown");
  });

  it("hides the sheet again once the shell is wide enough to hold the panel", async () => {
    const { rerender } = render(<Reader narrow />);

    await pressed(screen.getByRole("button"));
    rerender(<Reader narrow={false} />);

    expect(screen.getByRole("button").textContent).toBe("hidden");
  });

  it("starts hidden every time the shell narrows anew", async () => {
    const { rerender } = render(<Reader narrow />);

    await pressed(screen.getByRole("button"));
    rerender(<Reader narrow={false} />);
    rerender(<Reader narrow />);

    expect(screen.getByRole("button").textContent).toBe("hidden");
  });
});
