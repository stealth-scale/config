import { type ReactElement, type RefObject, useRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useFocused } from "#focus/focus.ts";

/**
 * Describes what the sheet under test is drawn with.
 */
interface SheetProps {
  /**
   * Where the reader stood when they asked for the sheet, where a case writes it down itself.
   */
  readonly from?: RefObject<HTMLElement | null> | undefined;

  /**
   * Whether the sheet is over the page and open now.
   */
  readonly shown: boolean;
}

/**
 * Draws a sheet the reader is taken into, and a control outside it that opened the sheet.
 *
 * @param props - Whether the sheet is shown, and where the reader came from.
 * @returns The control and the sheet.
 */
function Sheet({ from, shown }: SheetProps): ReactElement {
  const inner = useRef<HTMLDivElement>(null);

  useFocused(inner, shown, undefined, from);

  return (
    <>
      <button type="button">Navigation</button>
      <div data-testid="sheet" ref={inner} tabIndex={-1}>
        <a href="/invoices">Invoices</a>
      </div>
    </>
  );
}

describe("useFocused", () => {
  it("leaves the reader where they were while nothing stands over the page", () => {
    render(<Sheet shown={false} />);

    expect(document.activeElement).toBe(document.body);
  });

  it("takes the reader into the sheet once it stands over the page", () => {
    render(<Sheet shown />);

    expect(document.activeElement).toBe(screen.getByTestId("sheet"));
  });

  it("puts the reader back on the control that opened the sheet", () => {
    const { rerender } = render(<Sheet shown={false} />);

    screen.getByRole("button", { name: "Navigation" }).focus();
    rerender(<Sheet shown />);
    rerender(<Sheet shown={false} />);

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Navigation" }));
  });

  it("gives focus back to nothing where the reader was standing on no element", () => {
    const { rerender } = render(<Sheet shown={false} />);

    Object.defineProperty(document, "activeElement", { configurable: true, value: null });
    rerender(<Sheet shown />);
    Reflect.deleteProperty(document, "activeElement");
    rerender(<Sheet shown={false} />);

    expect(document.activeElement).toBe(screen.getByTestId("sheet"));
  });

  it("returns the reader to the control a caller wrote down rather than to the document", () => {
    const remembered = { current: null } as { current: HTMLElement | null };
    const { rerender } = render(<Sheet shown={false} />);

    remembered.current = screen.getByRole("button", { name: "Navigation" });
    rerender(<Sheet from={remembered} shown />);
    rerender(<Sheet from={remembered} shown={false} />);

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Navigation" }));
  });

  it("leaves the reader in the sheet where the control it came from has gone", () => {
    const { rerender, unmount } = render(<Sheet shown={false} />);

    screen.getByRole("button", { name: "Navigation" }).focus();
    rerender(<Sheet shown />);
    unmount();

    expect(document.activeElement).toBe(document.body);
  });
});
