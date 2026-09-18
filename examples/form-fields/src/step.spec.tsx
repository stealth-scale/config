import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type StepProps } from "@stealthscale/provider-form";

import { useAppForm } from "#hook.ts";
import { Step } from "#step.tsx";

const onGo = vi.fn<(index: number) => void>();
const labels = ["Who", "About", "Done"];

/**
 * Draws the step under a form, as the foundation does.
 */
function Harness({
  current,
  kind = "wizard",
}: Partial<Pick<StepProps, "kind">> & Pick<StepProps, "current">): ReactElement {
  const form = useAppForm({ defaultValues: {} });

  return (
    <form.AppForm>
      <form.Form>
        <Step current={current} id="profile-0" kind={kind} labels={labels} onGo={onGo}>
          <input aria-label="Inner" />
        </Step>
      </form.Form>
    </form.AppForm>
  );
}

describe("Step", () => {
  it("draws the label of the step and a way forward on the first step", () => {
    const { getByRole, queryByRole } = render(<Harness current={0} />);
    const heading = getByRole("heading", { level: 2 });

    expect(heading.textContent).toBe("Who");
    expect(heading.closest("div")?.id).toBe("profile-0");
    expect(queryByRole("button", { name: "Back" })).toBeNull();

    fireEvent.click(getByRole("button", { name: "Next" }));

    expect(onGo).toHaveBeenLastCalledWith(1);
  });

  it("gives the heading a tab index so focus moving into the step reads the name first", () => {
    const { getByRole } = render(<Harness current={0} />);

    expect(getByRole("heading", { level: 2 }).tabIndex).toBe(-1);
  });

  it("draws a way back and the submit on the last step", () => {
    const { getByRole, queryByRole } = render(<Harness current={2} />);

    expect(queryByRole("button", { name: "Next" })).toBeNull();
    expect(getByRole("button", { name: "Submit" }).getAttribute("type")).toBe("submit");

    fireEvent.click(getByRole("button", { name: "Back" }));

    expect(onGo).toHaveBeenLastCalledWith(1);
  });

  it("draws every label as a tab where the steps are tabs", () => {
    const { getByRole } = render(<Harness current={0} kind="tabs" />);

    expect(getByRole("button", { name: "Who" }).getAttribute("aria-current")).toBe("true");

    fireEvent.click(getByRole("button", { name: "Done" }));

    expect(onGo).toHaveBeenLastCalledWith(2);
  });
});
