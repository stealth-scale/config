import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { ACTIONS } from "#command/actions.fixtures.ts";
import { type CommandOptions, useCommandState } from "#command/state.ts";

/**
 * Says how many matches are left, so a case can read the line off the screen.
 *
 * @param matches - How many actions are still listed.
 * @returns The line.
 */
function counted(matches: number): string {
  return `${String(matches)} left`;
}

/**
 * Runs the palette and reports what is left of it, with a control that narrows it.
 *
 * @param props - What to narrow to, and what to say about the count.
 * @returns The rows left, drawn as text.
 */
function Reader(props: { to: string } & Partial<CommandOptions>): ReactElement {
  const { to, ...rest } = props;
  const palette = useCommandState({
    actions: ACTIONS,
    count: counted,
    label: "Commands",
    ...rest,
  });

  return (
    <>
      <button
        onClick={() => {
          palette.narrow(to);
        }}
        type="button"
      >
        Narrow
      </button>
      <span data-testid="left">{palette.collection.items.map((row) => row.label).join(",")}</span>
      <span data-testid="typed">{palette.typed}</span>
    </>
  );
}

describe("useCommandState", () => {
  it("holds every action before anything is typed", () => {
    render(<Reader to="" />);

    expect(screen.getByTestId("left").textContent).toBe("Invoices,Reports,New document");
  });

  it("keeps the actions whose words match what was typed", async () => {
    render(<Reader to="rep" />);
    await pressed(screen.getByRole("button"));

    expect(screen.getByTestId("left").textContent).toBe("Reports");
  });

  it("matches an action by the words added to it", async () => {
    render(<Reader to="create" />);
    await pressed(screen.getByRole("button"));

    expect(screen.getByTestId("left").textContent).toBe("New document");
  });

  it("reports what was typed", async () => {
    render(<Reader to="rep" />);
    await pressed(screen.getByRole("button"));

    expect(screen.getByTestId("typed").textContent).toBe("rep");
  });

  it("carries the words the palette is named by", () => {
    render(<Reader to="" />);

    expect(screen.getByTestId("left")).toBeTruthy();
  });
});
