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

import { createElement, type ElementType, type ReactNode } from "react";

import { render } from "@testing-library/react";

import { only } from "#part.ts";

/**
 * The parts of the contract that are not every component's to keep.
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
 * Mounts a component once, reads one thing off the element it rendered, and unmounts it.
 *
 * Unmounted rather than left in the document, so one check cannot read the element another check
 * rendered.
 *
 * Throws where nothing was rendered, which `renders` is what guards against: every caller below it
 * has already established that the component renders, so a throw here means a component that
 * renders with its own props and stops once it is handed children or `asChild` — rare enough to
 * report as `only`'s own sentence rather than to carry an optional through every check.
 *
 * @param Component - The component to mount.
 * @param props - The props to mount it with.
 * @param read - The reading to take off the element it rendered.
 * @returns The reading.
 * @throws Error Where it rendered no element.
 */
function mounted<Held>(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
  read: (element: HTMLElement) => Held,
): Held {
  const { container, unmount } = render(createElement(Component, props));

  try {
    return read(only(container));
  } finally {
    unmount();
  }
}

/**
 * Answers whether a component renders an element at all.
 *
 * The one check that cannot assume the answer to itself, and the reason every check after it can.
 *
 * @param Component - The component to mount.
 * @param props - The props it requires before it renders.
 * @returns `true` where it rendered an element.
 */
function renders(Component: ElementType, props: Readonly<Record<string, unknown>>): boolean {
  try {
    mounted(Component, props, (element) => element.tagName);

    return true;
  } catch {
    return false;
  }
}

/**
 * The child a component is asked to render in place of its own element.
 */
const CHILD: ReactNode = createElement("a", { href: "#conformance" });

/**
 * Checks what a component does with the `className` it is passed.
 *
 * Two failures, and they are different bugs. A component that never reads the prop drops the
 * caller's class; one that reads it and assigns it drops its own. Both leave an element styled
 * wrongly, and only the second of them looks right at the call site.
 *
 * @param Component - The component to check.
 * @param props - The props it requires before it renders.
 * @returns Each violation, empty where it merges.
 */
function classNames(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
): readonly string[] {
  const merged = mounted(Component, { ...props, className: PROBE }, (rendered) => [
    ...rendered.classList,
  ]);
  const own = mounted(Component, props, (rendered) => [...rendered.classList]);

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
 * @returns Each violation, empty where it passes both on.
 */
function forwarding(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
): readonly string[] {
  let forwarded: unknown;
  const rendered = mounted(
    Component,
    {
      ...props,
      ref: (held: unknown) => {
        forwarded ??= held;
      },
    },
    (held) => held,
  );
  const spread = mounted(Component, { ...props, [MARK]: "held" }, (held) =>
    held.getAttribute(MARK),
  );

  return [
    ...(forwarded === rendered ? [] : ["does not forward ref"]),
    ...(spread === "held" ? [] : ["does not spread unknown props"]),
  ];
}

/**
 * Checks the two parts of the contract that are not every component's to keep.
 *
 * A rule and a spacer take no children, and a component that renders its own element owes nothing
 * about `asChild`. Neither is checked unless the caller says the component offers it.
 *
 * @param Component - The component to check.
 * @param props - The props it requires before it renders.
 * @param options - Which of the two to check.
 * @returns Each violation, empty where it keeps the ones it was asked about.
 */
function optional(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
  options: ConformanceOptions,
): readonly string[] {
  const found: string[] = [];

  if (options.children === true) {
    const text = mounted(Component, { ...props, children: "held" }, (held) => held.textContent);

    if (text !== "held") found.push("does not render children");
  }

  if (options.asChild === true) {
    const swapped = mounted(
      Component,
      { ...props, asChild: true, children: CHILD },
      (held) => held.tagName,
    );

    if (swapped !== "A") found.push("does not honour asChild");
  }

  return found;
}

/**
 * Finds every part of the contract a component breaks.
 *
 * Each check mounts the component on its own and reads one thing off the element it rendered. A
 * component that renders nothing fails the first check and is asked no others, since every answer
 * after it would be the same failure restated.
 *
 * @param Component - The component to check.
 * @param options - The parts of the contract that are not every component's to keep.
 *   `ConformanceOptions` documents every member.
 * @returns Each violation, in the order the checks run. Empty for a component that conforms.
 */
export function violations(
  Component: ElementType,
  options: ConformanceOptions = {},
): readonly string[] {
  const props = options.props ?? {};

  if (!renders(Component, props)) return ["renders no element"];

  const element = mounted(Component, props, (rendered) => rendered.tagName);
  const wrong =
    options.element !== undefined && element !== options.element
      ? [`renders ${element}, not ${options.element}`]
      : [];

  return [
    ...wrong,
    ...classNames(Component, props),
    ...forwarding(Component, props),
    ...optional(Component, props, options),
  ];
}
