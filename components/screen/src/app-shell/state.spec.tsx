import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { bodied, narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Navbar } from "#app-shell/navbar.tsx";
import {
  COLLAPSES,
  FOLDS,
  useAppShellPanel,
  useNearestPanel,
  useOverlaid,
} from "#app-shell/state.ts";

/**
 * Reads one panel of the shell by name, the way an application reads it.
 *
 * @returns Whether the panel is shown.
 */
function Named(): ReactElement {
  return (
    <span data-testid="held">{useAppShellPanel("navbar")?.open === true ? "open" : "shut"}</span>
  );
}

/**
 * Reads the panel a part sits in, the way a part inside one reads it.
 *
 * @returns The address of the panel above it.
 */
function Nearest(): ReactElement {
  return <span data-testid="held">{useNearestPanel().id}</span>;
}

/**
 * Counts what stands over the page, the way a part behind the backdrop reads it.
 *
 * @returns How many panels stand over the page.
 */
function Counted(): ReactElement {
  return <span data-testid="held">{useOverlaid().length}</span>;
}

describe("COLLAPSES", () => {
  it("lists the two things closing a panel leaves", () => {
    expect(COLLAPSES).toStrictEqual(["hide", "icons"]);
  });
});

describe("FOLDS", () => {
  it("lists the two places a folded panel goes", () => {
    expect(FOLDS).toStrictEqual(["over", "under"]);
  });
});

describe("useAppShellPanel", () => {
  it("answers the panel drawn under the name it was asked for", () => {
    render(bodied(<Navbar>{<Named />}</Navbar>));

    expect(screen.getByTestId("held").textContent).toBe("open");
  });

  it("answers nothing for a name no panel was drawn under", () => {
    render(bodied(<Named />));

    expect(screen.getByTestId("held").textContent).toBe("shut");
  });

  it("throws where no shell stands above the reader", () => {
    expect(() => render(<Named />)).toThrow(/AppShell\.Root/u);
  });
});

describe("useNearestPanel", () => {
  it("answers the panel it sits in", () => {
    const { container } = render(bodied(<Navbar>{<Nearest />}</Navbar>));

    expect(screen.getByTestId("held").textContent).toBe(
      container.querySelector(".app-shell__navbar")?.id,
    );
  });

  it("throws where no panel stands above the reader", () => {
    expect(() => render(bodied(<Nearest />))).toThrow(/AppShell panel/u);
  });
});

describe("useOverlaid", () => {
  it("counts nothing while every panel sits beside the page", () => {
    render(bodied(<Navbar>{<Counted />}</Navbar>));

    expect(screen.getByTestId("held").textContent).toBe("0");
  });

  it("counts a panel the application has opened over the page", () => {
    render(
      narrowed(
        bodied(
          <Navbar open>
            <Counted />
          </Navbar>,
        ),
      ),
    );

    expect(screen.getByTestId("held").textContent).toBe("1");
  });
});
