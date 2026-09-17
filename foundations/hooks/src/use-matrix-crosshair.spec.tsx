import { type PointerEvent, type ReactElement } from "react";

import { fireEvent, render, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useMatrixCrosshair } from "#use-matrix-crosshair.ts";

function Cells(): ReactElement {
  return (
    <>
      <span data-column="c1" data-row="r1" data-testid="r1c1">
        <i data-testid="mark" />
      </span>
      <span data-column="c2" data-row="r1" data-testid="r1c2" />
      <span data-column="c1" data-row="r2" data-testid="r2c1" />
      <span data-column="c3" data-row="r3" data-testid="r3c3" />
    </>
  );
}

function Grid(): ReactElement {
  const { clear, ref, track } = useMatrixCrosshair<HTMLDivElement>();

  return (
    <div data-testid="grid" onPointerLeave={clear} onPointerMove={track} ref={ref}>
      <Cells />
    </div>
  );
}

function Loose(): ReactElement {
  const { ref, track } = useMatrixCrosshair<HTMLDivElement>();

  return (
    <div data-testid="grid" onPointerMove={track}>
      <span data-testid="held" ref={ref} />
      <Cells />
    </div>
  );
}

describe("useMatrixCrosshair", () => {
  it("lights every cell of the row under the pointer", () => {
    const { getByTestId } = render(<Grid />);

    fireEvent.pointerMove(getByTestId("r1c1"));

    expect(getByTestId("r1c2").dataset["lit"]).toBe("");
  });

  it("lights every cell of the column under the pointer", () => {
    const { getByTestId } = render(<Grid />);

    fireEvent.pointerMove(getByTestId("r1c1"));

    expect(getByTestId("r2c1").dataset["lit"]).toBe("");
  });

  it("leaves a cell in neither the row nor the column unlit", () => {
    const { getByTestId } = render(<Grid />);

    fireEvent.pointerMove(getByTestId("r1c1"));

    expect(getByTestId("r3c3").dataset["lit"]).toBeUndefined();
  });

  it("puts the previous lights out when the pointer moves", () => {
    const { getByTestId } = render(<Grid />);

    fireEvent.pointerMove(getByTestId("r1c1"));
    fireEvent.pointerMove(getByTestId("r3c3"));

    expect(getByTestId("r1c2").dataset["lit"]).toBeUndefined();
  });

  it("puts every light out when the pointer leaves the grid", () => {
    const { getByTestId } = render(<Grid />);

    fireEvent.pointerMove(getByTestId("r1c1"));
    fireEvent.pointerLeave(getByTestId("grid"));

    expect(getByTestId("r1c1").dataset["lit"]).toBeUndefined();
  });

  it("reads the row off the nearest marked ancestor of the target", () => {
    const { getByTestId } = render(<Grid />);

    fireEvent.pointerMove(getByTestId("mark"));

    expect(getByTestId("r1c2").dataset["lit"]).toBe("");
  });

  it("lights nothing when the pointer is over no marked element", () => {
    const { getByTestId } = render(<Grid />);

    fireEvent.pointerMove(getByTestId("grid"));

    expect(getByTestId("r1c1").dataset["lit"]).toBeUndefined();
  });

  it("lights nothing when the grid holds none of the marked cells", () => {
    const { getByTestId } = render(<Loose />);

    fireEvent.pointerMove(getByTestId("r1c1"));

    expect(getByTestId("r1c2").dataset["lit"]).toBeUndefined();
  });

  it("lights nothing when the ref was never hung on an element", () => {
    const { result } = renderHook(() => useMatrixCrosshair());
    const { getByTestId } = render(<Grid />);

    result.current.clear();

    expect(getByTestId("r1c1").dataset["lit"]).toBeUndefined();
  });

  it("lights nothing when the target is not an element", () => {
    const { result } = renderHook(() => useMatrixCrosshair());
    const { getByTestId } = render(<Grid />);

    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a pointer event raised on a text node carries a target the handler has to refuse
    result.current.track({ target: null } as unknown as PointerEvent<HTMLElement>);

    expect(getByTestId("r1c1").dataset["lit"]).toBeUndefined();
  });
});
