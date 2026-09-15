import { createContext, type ReactElement, type ReactNode, type Ref, use } from "react";

import { describe, expect, it } from "vite-plus/test";

import { violations } from "#conformance.tsx";
import { part } from "#part.ts";

/**
 * The props a component written here accepts.
 */
interface ProbeProps {
  /**
   * Whether it renders the child in place of its own element.
   */
  asChild?: boolean | undefined;

  /**
   * The children to render.
   */
  children?: ReactNode | undefined;

  /**
   * The class the caller passed in.
   */
  className?: string | undefined;

  /**
   * Where the caller wants the element that was rendered.
   */
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Joins a component's own class with the one the caller passed in.
 *
 * @param className - The caller's class, where there is one.
 * @returns Both of them, which is what merging means.
 */
function merged(className?: string): string {
  return ["own", className].filter(Boolean).join(" ");
}

/**
 * Copies props without one of them, for a component that drops it on purpose.
 *
 * @param props - The props to copy.
 * @param dropped - The prop to leave out.
 * @returns The rest of them.
 */
function without(props: ProbeProps, dropped: keyof ProbeProps): ProbeProps {
  const held: ProbeProps = { ...props };

  Reflect.deleteProperty(held, dropped);

  return held;
}

/**
 * A component that keeps every part of the contract.
 *
 * @param props - The props. `ProbeProps` documents every member.
 * @returns The element.
 */
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

/**
 * A component that renders nothing at all.
 *
 * @returns No element.
 */
function Nothing(): null {
  return null;
}

/**
 * A component that ignores the class it was passed.
 *
 * @param props - The props.
 * @returns The element.
 */
function Ignoring(props: ProbeProps): ReactElement {
  return <Conforming {...without(props, "className")} />;
}

/**
 * A component that overwrites its own class with the caller's rather than merging the two.
 *
 * @param props - The props.
 * @returns The element.
 */
function Overwriting({ children, className, ref, ...rest }: ProbeProps): ReactElement {
  return (
    <div className={className ?? "own"} ref={ref} {...rest}>
      {children}
    </div>
  );
}

/**
 * A component that accepts a ref and never forwards it.
 *
 * @param props - The props.
 * @returns The element.
 */
function Unforwarding(props: ProbeProps): ReactElement {
  return <Conforming {...without(props, "ref")} />;
}

/**
 * A component that swallows the props it does not name.
 *
 * @param props - The props.
 * @returns The element.
 */
function Swallowing({ children, className, ref }: ProbeProps): ReactElement {
  return (
    <div className={merged(className)} ref={ref}>
      {children}
    </div>
  );
}

/**
 * A component that renders none of its children.
 *
 * @param props - The props.
 * @returns The element.
 */
function Childless(props: ProbeProps): ReactElement {
  return <Conforming {...without(props, "children")} />;
}

/**
 * A component that keeps its own element where `asChild` was passed.
 *
 * @param props - The props.
 * @returns The element.
 */
function Keeping(props: ProbeProps): ReactElement {
  return <Conforming {...without(props, "asChild")} />;
}

/**
 * A component that takes neither children nor `asChild`, the way a rule or a spacer does.
 *
 * @param props - The props.
 * @returns The element.
 */
function Plain(props: ProbeProps): ReactElement {
  return <Conforming {...without(without(props, "children"), "asChild")} />;
}

/**
 * A component that refuses to render without a ratio, the way an aspect ratio does.
 *
 * @param props - A ratio, and the props a probe accepts.
 * @returns The element.
 * @throws Error Where it was given no ratio.
 */
function Requiring({ ratio, ...rest }: { ratio?: number } & ProbeProps): ReactElement {
  if (ratio === undefined) throw new Error("A ratio is required.");

  return <Conforming {...rest} />;
}

/**
 * Carries the class a part reads, so that a part rendered without its provider throws.
 */
const Slot = createContext<string | undefined>(undefined);

/**
 * A part of a compound, which reads its class from the provider above it.
 *
 * @param props - The props. `ProbeProps` documents every member.
 * @returns The element.
 * @throws Error Where it is rendered without its provider.
 */
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

/**
 * The provider a part needs above it.
 *
 * @param props - The subtree.
 * @param props.children - The subtree.
 * @returns The subtree, with the slot in scope.
 */
function Root({ children }: { children?: ReactNode }): ReactElement {
  return (
    <section data-part="root">
      <Slot value="own">{children}</Slot>
    </section>
  );
}

/**
 * A component that throws something that is not an error.
 *
 * @returns Nothing; it never returns.
 * @throws String Always.
 */
function Thrower(): ReactElement {
  // eslint-disable-next-line no-throw-literal, typescript/only-throw-error -- the case is a component that throws something other than an error, which is what the reader has to say something useful about
  throw "refused";
}

describe("violations", () => {
  it("finds none for a component that keeps every part of the contract", () => {
    const options = { asChild: true, children: true, element: "DIV" };

    expect(violations(Conforming, options)).toStrictEqual([]);
  });

  it("reports a component that renders nothing, and runs no further check on it", () => {
    expect(violations(Nothing)).toStrictEqual(["renders no element"]);
  });

  it("names both elements where a component renders one other than the one expected", () => {
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

  it("reports a component that swallows the props it does not name", () => {
    expect(violations(Swallowing)).toStrictEqual(["does not spread unknown props"]);
  });

  it("reports a component that renders none of its children", () => {
    expect(violations(Childless, { children: true })).toStrictEqual(["does not render children"]);
  });

  it("reports a component that keeps its own element where asChild was passed", () => {
    expect(violations(Keeping, { asChild: true })).toStrictEqual(["does not honour asChild"]);
  });

  it("checks neither children nor asChild unless it is asked to", () => {
    expect(violations(Plain)).toStrictEqual([]);
  });

  it("mounts a component with the props it requires before it renders at all", () => {
    expect(violations(Requiring, { props: { ratio: 2 } })).toStrictEqual([]);
  });
});

describe("violations, where a component cannot be rendered on its own", () => {
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

  it("reports a component that throws as throwing, rather than as rendering nothing", () => {
    expect(violations(Part)).toStrictEqual([
      "throws when it renders: Part cannot access its Provider.",
    ]);
  });

  it("reports what was thrown where it was not an error", () => {
    expect(violations(Thrower)).toStrictEqual(["throws when it renders: refused"]);
  });

  it("reports no element where the subject is not in what was rendered", () => {
    expect(
      violations(Conforming, {
        subject: (container) => part(container, "absent"),
      }),
    ).toStrictEqual(["renders no element"]);
  });
});
