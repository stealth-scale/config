import { type ReactElement, type RefObject } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useIsOverflowing } from "#use-is-overflowing.ts";

interface Size {
  clientHeight?: number;
  clientWidth?: number;
  scrollHeight?: number;
  scrollWidth?: number;
}

function sized(element: HTMLElement, size: Size): HTMLElement {
  for (const [name, value] of Object.entries({
    clientHeight: 0,
    clientWidth: 0,
    scrollHeight: 0,
    scrollWidth: 0,
    ...size,
  })) {
    Object.defineProperty(element, name, { configurable: true, value });
  }

  return element;
}

function loose(size: Size): HTMLElement {
  return sized(document.createElement("div"), size);
}

function nothing(): void {
  return undefined;
}

function deferred(): { ready: Promise<void>; release: () => void } {
  let release: () => void = nothing;
  const ready = new Promise<void>((resolve) => {
    release = resolve;
  });

  return { ready, release };
}

function Box({ watching }: { watching: RefObject<HTMLElement | null> }): ReactElement {
  const { horizontal, overflows, vertical } = useIsOverflowing(watching);

  return (
    <i
      data-across={String(horizontal)}
      data-down={String(vertical)}
      data-either={String(overflows)}
      data-testid="read"
    />
  );
}

function reading(watching: RefObject<HTMLElement | null>): DOMStringMap {
  const { getByTestId } = render(<Box watching={watching} />);

  return getByTestId("read").dataset;
}

describe("useIsOverflowing", () => {
  it("reports no overflow for an element whose content fits", () => {
    const read = reading({ current: loose({ clientWidth: 100, scrollWidth: 100 }) });

    expect(read["either"]).toBe("false");
  });

  it("reports a horizontal overflow when the content is wider than the box", () => {
    const read = reading({ current: loose({ clientWidth: 100, scrollWidth: 140 }) });

    expect(read["across"]).toBe("true");
  });

  it("reports a vertical overflow when the content is taller than the box", () => {
    const read = reading({ current: loose({ clientHeight: 40, scrollHeight: 90 }) });

    expect(read["down"]).toBe("true");
  });

  it("reports an overflow on either axis as overflows", () => {
    const read = reading({ current: loose({ clientHeight: 40, scrollHeight: 90 }) });

    expect(read["either"]).toBe("true");
  });

  it("reports no overflow for a single pixel of difference", () => {
    const read = reading({ current: loose({ clientWidth: 100, scrollWidth: 101 }) });

    expect(read["across"]).toBe("false");
  });

  it("reports no overflow while the ref holds nothing", () => {
    const read = reading({ current: null });

    expect(read["either"]).toBe("false");
  });

  it("measures an element whose parent is measured too", () => {
    const parent = document.createElement("div");
    const child = sized(document.createElement("div"), { clientWidth: 100, scrollWidth: 140 });

    parent.append(child);

    expect(reading({ current: child })["across"]).toBe("true");
  });

  it("keeps watching the same element across a render", () => {
    const watching = { current: loose({ clientWidth: 100, scrollWidth: 140 }) };
    const { getByTestId, rerender } = render(<Box watching={watching} />);

    rerender(<Box watching={watching} />);

    expect(getByTestId("read").dataset["across"]).toBe("true");
  });

  it("stops watching when the ref is emptied", () => {
    const watching: RefObject<HTMLElement | null> = {
      current: loose({ clientWidth: 100, scrollWidth: 140 }),
    };
    const { getByTestId, rerender } = render(<Box watching={watching} />);

    watching.current = null;
    rerender(<Box watching={watching} />);

    expect(getByTestId("read").dataset["across"]).toBe("true");
  });

  it("passes over a measurement queued for an element it no longer watches", async () => {
    const { ready, release } = deferred();
    const watching: RefObject<HTMLElement | null> = {
      current: loose({ clientWidth: 100, scrollWidth: 140 }),
    };

    Object.defineProperty(document, "fonts", { configurable: true, value: { ready } });

    const { getByTestId, rerender } = render(<Box watching={watching} />);

    watching.current = loose({ clientWidth: 100, scrollWidth: 100 });
    rerender(<Box watching={watching} />);
    release();
    await ready;

    expect(getByTestId("read").dataset["across"]).toBe("false");
    Reflect.deleteProperty(document, "fonts");
  });
});
