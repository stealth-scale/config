import { type ReactElement, useRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { narrowed, shell } from "#app-shell/app-shell.fixtures.tsx";
import { type PanelOptions, usePanel } from "#app-shell/use-panel.ts";

/**
 * Describes what the reader is drawn with.
 */
interface ReaderProps extends PanelOptions {
  /**
   * Which side of the page the panel it stands for sits on.
   */
  readonly side?: "end" | "start" | undefined;
}

/**
 * Works one panel out and writes down what it answered, without drawing a panel.
 *
 * @param props - How the panel folds and closes, and which side it is on.
 * @returns What the panel says about itself, and a control that opens and closes it.
 */
function Reader({ side = "start", ...options }: ReaderProps): ReactElement {
  const inner = useRef<HTMLDivElement>(null);
  const { inert, panel } = usePanel(side, options, inner);

  return (
    <button
      data-inert={inert ? "" : undefined}
      data-overlaid={panel.overlaid ? "" : undefined}
      data-stacked={panel.stacked ? "" : undefined}
      onClick={() => {
        panel.setOpen(!panel.open);
      }}
      type="button"
    >
      {panel.open ? "open" : "closed"}
    </button>
  );
}

describe("usePanel", () => {
  it("opens the panel where nothing says otherwise", () => {
    render(shell(<Reader />));

    expect(screen.getByRole("button").textContent).toBe("open");
  });

  it("sits the panel beside the page while the shell is wide enough for it", () => {
    render(shell(<Reader />));

    expect(screen.getByRole("button").dataset["overlaid"]).toBeUndefined();
  });

  it("lays the panel over the page once the shell is too narrow for it", () => {
    render(narrowed(shell(<Reader />)));

    expect(screen.getByRole("button").dataset["overlaid"]).toBe("");
  });

  it("drops the panel under the page where it is told to", () => {
    render(narrowed(shell(<Reader folds="under" />)));

    expect(screen.getByRole("button").dataset["stacked"]).toBe("");
  });

  it("shows a panel under the page whatever else it was told", () => {
    render(narrowed(shell(<Reader defaultOpen={false} folds="under" />)));

    expect(screen.getByRole("button").textContent).toBe("open");
  });

  it("opens and closes the panel beside the page", async () => {
    render(shell(<Reader />));

    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toBe("closed");
  });

  it("opens and closes the panel over the page", async () => {
    render(narrowed(shell(<Reader />)));

    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toBe("open");
  });

  it("tells a caller that is listening what the panel was set to", async () => {
    const told: boolean[] = [];

    render(
      shell(
        <Reader
          onOpenChange={(open) => {
            told.push(open);
          }}
        />,
      ),
    );

    await pressed(screen.getByRole("button"));

    expect(told).toStrictEqual([false]);
  });

  it("holds the panel inert where it is closed to nothing", () => {
    render(shell(<Reader defaultOpen={false} />));

    expect(screen.getByRole("button").dataset["inert"]).toBe("");
  });

  it("keeps a panel closed to a rail of marks reachable", () => {
    render(shell(<Reader collapse="icons" defaultOpen={false} />));

    expect(screen.getByRole("button").dataset["inert"]).toBeUndefined();
  });

  it("writes down nothing where the reader was standing on no element", async () => {
    render(narrowed(shell(<Reader />)));

    Object.defineProperty(document, "activeElement", { configurable: true, value: null });
    await pressed(screen.getByRole("button"));
    Reflect.deleteProperty(document, "activeElement");

    expect(screen.getByRole("button").textContent).toBe("open");
  });

  it("folds the end side at a wider screen than the start side", () => {
    render(narrowed(shell(<Reader side="end" />)));

    expect(screen.getByRole("button").dataset["overlaid"]).toBe("");
  });
});
