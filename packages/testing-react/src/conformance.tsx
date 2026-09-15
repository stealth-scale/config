/**
 * The contract every component owes whoever renders it, read as a list of what it breaks.
 *
 * A component in a design system is not only its own markup. A consumer puts a `className` on it,
 * holds a `ref` to it, spreads an attribute onto it and expects every one of those to reach the
 * element that was rendered. None of it is what the component is for, all of it is what makes it
 * usable from the outside, and each is dropped the same way: by binding a recipe to an element and
 * spreading nothing.
 *
 * Answered as a list of violations rather than as a verdict, the way an audit is. A specification
 * writes one assertion and a failure names the prop that went missing — "does not forward ref" —
 * rather than saying that `false` is not `true`. That is also what keeps this package free of a
 * test runner: nothing here asserts.
 */

import { createElement, type ElementType, type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";

import { only } from "#part.ts";

/**
 * The parts of the contract that are not every component's to keep, and how to reach a component
 * that cannot be rendered on its own.
 */
export interface ConformanceOptions {
  /**
   * Whether it renders the child it is given in place of its own element. Default: unchecked,
   * since a component that renders its own element owes nothing here.
   */
  asChild?: boolean | undefined;

  /**
   * Whether it renders its children. Default: unchecked, because a rule and a spacer take none,
   * and passing children to either is a mistake rather than a contract.
   */
  children?: boolean | undefined;

  /**
   * The tag it should render, as the DOM reports it: `DIV`, `SPAN`, `IFRAME`. Default: unchecked,
   * since the element a box renders is the caller's business.
   */
  element?: string | undefined;

  /**
   * The props it requires before it renders at all: a ratio, a label, a value. Default: none.
   */
  props?: Readonly<Record<string, unknown>> | undefined;

  /**
   * Finds the element under test in what was rendered. Default: the one element the render
   * produced, which is right for a component rendered on its own and wrong under a `wrapper`,
   * where the first element belongs to the wrapper. `part` is what a compound's slot is found
   * with.
   */
  subject?: ((container: ParentNode) => HTMLElement) | undefined;

  /**
   * Renders the component inside whatever it needs above it: the provider a compound's part reads
   * its state from, a theme, a router. Default: rendered on its own.
   *
   * A part of a compound throws without its provider rather than rendering badly, so without this
   * the only thing a check could report is that the provider is missing — which says nothing about
   * the part.
   */
  wrapper?: ((children: ReactNode) => ReactElement) | undefined;
}

/**
 * The `className` a check passes in to see whether it is merged.
 */
const PROBE = "conformance-probe";

/**
 * The attribute a check spreads on to see whether it reaches the element.
 */
const MARK = "data-conformance";

/**
 * Renders a component, with whatever it needs above it.
 *
 * @param Component - The component to render.
 * @param props - The props to render it with.
 * @param options - The wrapper to render it inside, where it needs one.
 * @returns The rendered output and how to take it down again.
 */
function drawn(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
  options: ConformanceOptions,
): ReturnType<typeof render> {
  const element = createElement(Component, props);

  return render(options.wrapper === undefined ? element : options.wrapper(element));
}

/**
 * Finds the element under test in what was rendered.
 *
 * @param container - The rendered output.
 * @param options - The finder, where the caller supplied one.
 * @returns The element under test.
 * @throws Error Where it is not there.
 */
function subjectOf(container: ParentNode, options: ConformanceOptions): HTMLElement {
  return options.subject === undefined ? only(container) : options.subject(container);
}

/**
 * Mounts a component once, reads one thing off the element under test, and unmounts it.
 *
 * Unmounted rather than left in the document, so one check cannot read the element another check
 * rendered.
 *
 * @param Component - The component to mount.
 * @param props - The props to mount it with.
 * @param read - The reading to take off the element under test.
 * @param options - The wrapper to mount it inside, and the finder for the element.
 * @returns The reading.
 * @throws Error Where the component throws, or the element under test is not there.
 */
function mounted<Held>(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
  read: (element: HTMLElement) => Held,
  options: ConformanceOptions,
): Held {
  const { container, unmount } = drawn(Component, props, options);

  try {
    return read(subjectOf(container, options));
  } finally {
    unmount();
  }
}

/**
 * Says what went wrong, whatever was thrown.
 *
 * @param error - The value that was thrown.
 * @returns Its message, or the value itself where it is not an error.
 */
function reason(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Checks that there is an element to check at all.
 *
 * The one check that cannot assume its own answer, and the reason every check after it can. A
 * component that throws is reported as throwing rather than as rendering nothing: the two are
 * different bugs, and a compound's part missing its provider throws.
 *
 * @param Component - The component to mount.
 * @param props - The props it requires before it renders.
 * @param options - The wrapper to mount it inside, and the finder for the element.
 * @returns The violation, or nothing where there is an element.
 */
function rendering(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
  options: ConformanceOptions,
): string | undefined {
  let held: ReturnType<typeof render>;

  try {
    held = drawn(Component, props, options);
  } catch (error) {
    return `throws when it renders: ${reason(error)}`;
  }

  try {
    subjectOf(held.container, options);

    return undefined;
  } catch {
    return "renders no element";
  } finally {
    held.unmount();
  }
}

/**
 * Checks what a component does with the `className` it is passed.
 *
 * Two failures, and they are different bugs. A component that never reads the prop drops the
 * caller's class; one that reads it and assigns it drops its own. Both leave an element styled
 * wrongly, and only the second of them looks right at the call site.
 *
 * @param Component - The component to check.
 * @param props - The props it requires before it renders.
 * @param options - The wrapper to mount it inside, and the finder for the element.
 * @returns Each violation, empty where it merges.
 */
function classNames(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
  options: ConformanceOptions,
): readonly string[] {
  const merged = mounted(
    Component,
    { ...props, className: PROBE },
    (element) => [...element.classList],
    options,
  );
  const own = mounted(Component, props, (element) => [...element.classList], options);

  return [
    ...(merged.includes(PROBE) ? [] : ["does not merge className"]),
    ...(own.every((one) => merged.includes(one))
      ? []
      : ["replaces its own className instead of merging"]),
  ];
}

/**
 * Checks what a component passes on rather than keeps.
 *
 * The `ref` has to reach the element that was rendered, and an attribute the component has never
 * heard of has to reach it too. Both are how a consumer reaches past the component's own interface
 * to the DOM under it, which every wrapper in a design system is expected to allow.
 *
 * @param Component - The component to check.
 * @param props - The props it requires before it renders.
 * @param options - The wrapper to mount it inside, and the finder for the element.
 * @returns Each violation, empty where it passes both on.
 */
function forwarding(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
  options: ConformanceOptions,
): readonly string[] {
  let forwarded: unknown;
  const element = mounted(
    Component,
    {
      ...props,
      ref: (held: unknown) => {
        forwarded ??= held;
      },
    },
    (held) => held,
    options,
  );
  const spread = mounted(
    Component,
    { ...props, [MARK]: "held" },
    (held) => held.getAttribute(MARK),
    options,
  );

  return [
    ...(forwarded === element ? [] : ["does not forward ref"]),
    ...(spread === "held" ? [] : ["does not spread unknown props"]),
  ];
}

/**
 * The child a component is asked to render in place of its own element.
 */
const CHILD: ReactNode = createElement("a", { href: "#conformance" });

/**
 * Checks the two parts of the contract that are not every component's to keep.
 *
 * A rule and a spacer take no children, and a component that renders its own element owes nothing
 * about `asChild`. Neither is checked unless the caller says the component offers it.
 *
 * @param Component - The component to check.
 * @param props - The props it requires before it renders.
 * @param options - Which of the two to check, the wrapper, and the finder for the element.
 * @returns Each violation, empty where it keeps the ones it was asked about.
 */
function optional(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
  options: ConformanceOptions,
): readonly string[] {
  const found: string[] = [];

  if (options.children === true) {
    const text = mounted(
      Component,
      { ...props, children: "held" },
      (held) => held.textContent,
      options,
    );

    if (text !== "held") found.push("does not render children");
  }

  if (options.asChild === true) {
    const swapped = mounted(
      Component,
      { ...props, asChild: true, children: CHILD },
      (held) => held.tagName,
      options,
    );

    if (swapped !== "A") found.push("does not honour asChild");
  }

  return found;
}

/**
 * Finds every part of the contract a component breaks.
 *
 * Each check mounts the component on its own and reads one thing off the element under test. A
 * component that throws, or that renders no element to check, fails the first and is asked no
 * others, since every answer after it would be the same failure restated.
 *
 * A compound's part is checked by naming the provider it needs as `wrapper` and the slot as
 * `subject`: without the first it throws, and without the second the element under test would be
 * the wrapper's rather than the part's.
 *
 * @param Component - The component to check.
 * @param options - The parts of the contract that are not every component's to keep, and how to
 *   reach a component that cannot be rendered on its own. `ConformanceOptions` documents every
 *   member.
 * @returns Each violation, in the order the checks run. Empty for a component that conforms.
 */
export function violations(
  Component: ElementType,
  options: ConformanceOptions = {},
): readonly string[] {
  const props = options.props ?? {};
  const failed = rendering(Component, props, options);

  if (failed !== undefined) return [failed];

  const element = mounted(Component, props, (held) => held.tagName, options);
  const wrong =
    options.element !== undefined && element !== options.element
      ? [`renders ${element}, not ${options.element}`]
      : [];

  return [
    ...wrong,
    ...classNames(Component, props, options),
    ...forwarding(Component, props, options),
    ...optional(Component, props, options),
  ];
}
