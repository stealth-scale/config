import { createContext, type ReactElement, type ReactNode, type Ref, use } from "react";

import { describe, expect, it } from "vitest";

import { violations } from "#conformance.tsx";
import { part } from "#part.ts";

interface ProbeProps {
  asChild?: boolean | undefined;

  children?: ReactNode | undefined;

  className?: string | undefined;

  ref?: Ref<HTMLDivElement> | undefined;
}

function merged(className?: string): string {
  return ["own", className].filter(Boolean).join(" ");
}

function without(props: ProbeProps, dropped: keyof ProbeProps): ProbeProps {
  const held: ProbeProps = { ...props };

  Reflect.deleteProperty(held, dropped);

  return held;
}

function Conforming({ asChild, children, className, ref, ...rest }: ProbeProps): ReactElement {
  if (asChild === true) {
    return (
      <a className={merged(className)} href="#conformance" {...rest}>
        held
      </a>
    );
  }

  return (
    <div className={merged(className)} ref={ref} {...rest}>
      {children}
    </div>
  );
}

function Nothing(): null {
  return null;
}

function Ignoring(props: ProbeProps): ReactElement {
  return <Conforming {...without(props, "className")} />;
}

function Overwriting({ children, className, ref, ...rest }: ProbeProps): ReactElement {
  return (
    <div className={className ?? "own"} ref={ref} {...rest}>
      {children}
    </div>
  );
}

function Unforwarding(props: ProbeProps): ReactElement {
  return <Conforming {...without(props, "ref")} />;
}

function Swallowing({ children, className, ref }: ProbeProps): ReactElement {
  return (
    <div className={merged(className)} ref={ref}>
      {children}
    </div>
  );
}

function Childless(props: ProbeProps): ReactElement {
  return <Conforming {...without(props, "children")} />;
}

function Keeping(props: ProbeProps): ReactElement {
  return <Conforming {...without(props, "asChild")} />;
}

function Plain(props: ProbeProps): ReactElement {
  return <Conforming {...without(without(props, "children"), "asChild")} />;
}

function Requiring({ ratio, ...rest }: { ratio?: number } & ProbeProps): ReactElement {
  if (ratio === undefined) throw new Error("A ratio is required.");

  return <Conforming {...rest} />;
}

const Slot = createContext<string | undefined>(undefined);

function Part({ children, className, ref, ...rest }: ProbeProps): ReactElement {
  const slot = use(Slot);

  if (slot === undefined) throw new Error("Part cannot access its Provider.");

  return (
    <div
      className={[slot, className].filter(Boolean).join(" ")}
      data-part="part"
      ref={ref}
      {...rest}
    >
      {children}
    </div>
  );
}

function Root({ children }: { children?: ReactNode }): ReactElement {
  return (
    <section data-part="root">
      <Slot value="own">{children}</Slot>
    </section>
  );
}

function Thrower(): ReactElement {
  // eslint-disable-next-line no-throw-literal, typescript/only-throw-error -- the case is a component that throws something other than an error, which is what the reader has to say something useful about
  throw "refused";
}

describe("violations", () => {
  it("returns no violation for a component that keeps the contract", () => {
    const options = { asChild: true, children: true, element: "DIV" };

    expect(violations(Conforming, options)).toStrictEqual([]);
  });

  it("reports a component that renders nothing", () => {
    expect(violations(Nothing)).toStrictEqual(["renders no element"]);
  });

  it("names both elements when a component renders the wrong one", () => {
    expect(violations(Conforming, { element: "SPAN" })).toStrictEqual(["renders DIV, not SPAN"]);
  });

  it("reports a component that ignores className", () => {
    expect(violations(Ignoring)).toStrictEqual(["does not merge className"]);
  });

  it("reports a component that overwrites its own className with the caller's", () => {
    expect(violations(Overwriting)).toStrictEqual([
      "replaces its own className instead of merging",
    ]);
  });

  it("reports a component that accepts a ref and never forwards it", () => {
    expect(violations(Unforwarding)).toStrictEqual(["does not forward ref"]);
  });

  it("reports a component that drops the props it does not name", () => {
    expect(violations(Swallowing)).toStrictEqual(["does not spread unknown props"]);
  });

  it("reports a component that renders none of its children", () => {
    expect(violations(Childless, { children: true })).toStrictEqual(["does not render children"]);
  });

  it("reports a component that keeps its own element when asChild was passed", () => {
    expect(violations(Keeping, { asChild: true })).toStrictEqual(["does not honour asChild"]);
  });

  it("checks neither children nor asChild unless asked", () => {
    expect(violations(Plain)).toStrictEqual([]);
  });

  it("mounts a component with the props it requires", () => {
    expect(violations(Requiring, { props: { ratio: 2 } })).toStrictEqual([]);
  });
});

describe("violationsWhenUnrenderable", () => {
  it("checks a part of a compound inside the provider it needs", () => {
    expect(
      violations(Part, {
        children: true,
        element: "DIV",
        subject: (container) => part(container, "part"),
        wrapper: (children) => <Root>{children}</Root>,
      }),
    ).toStrictEqual([]);
  });

  it("reports a component that throws as throwing", () => {
    expect(violations(Part)).toStrictEqual([
      "throws when it renders: Part cannot access its Provider.",
    ]);
  });

  it("reports what was thrown when it was not an error", () => {
    expect(violations(Thrower)).toStrictEqual(["throws when it renders: refused"]);
  });

  it("reports no element when the render omits the subject", () => {
    expect(
      violations(Conforming, {
        subject: (container) => part(container, "absent"),
      }),
    ).toStrictEqual(["renders no element"]);
  });
});
