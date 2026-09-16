/**
 * The contract every component keeps for whoever renders it, reported as a list of violations.
 *
 * A component in a design system is more than its own markup. A consumer sets a `className` on it,
 * takes a `ref` to it and spreads an attribute onto it, and each of those has to reach the rendered
 * element. A component drops all three the same way, by binding a recipe to an element and
 * spreading nothing.
 *
 * A check returns violations rather than a verdict. A specification writes one assertion, and a
 * failure names the prop that went missing rather than reporting that `false` is not `true`.
 * Nothing here asserts, so this package needs no test runner.
 */

import { createElement, type ElementType, type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";

import { only, type Rendered } from "#part.ts";

/**
 * The optional parts of the contract, and how to reach a component that cannot render on its own.
 */
export interface ConformanceOptions {
  /**
   * Whether it renders the child it is given in place of its own element. Default: unchecked,
   * because a component that renders its own element has no such behaviour to check.
   */
  asChild?: boolean | undefined;

  /**
   * Whether it renders its children. Default: unchecked, because a rule and a spacer take none,
   * and passing children to either is a mistake rather than a contract.
   */
  children?: boolean | undefined;

  /**
   * The tag it should render, as the DOM reports it: `DIV`, `SPAN`, `IFRAME`. Default: unchecked,
   * because the element a box renders is the caller's choice.
   */
  element?: string | undefined;

  /**
   * The props it requires before it renders at all: a ratio, a label, a value. Default: none.
   */
  props?: Readonly<Record<string, unknown>> | undefined;

  /**
   * Finds the element under test in what was rendered. Default: the one element the render
   * produced. That default is wrong under a `wrapper`, where the first element belongs to the
   * wrapper. Use `part` to find a compound's slot.
   */
  subject?: ((container: ParentNode) => Rendered) | undefined;

  /**
   * Renders the component inside whatever it needs above it: the provider a compound's part reads
   * its state from, a theme, a router. Default: rendered on its own.
   *
   * A part of a compound throws without its provider rather than rendering badly, so without this
   * the only thing a check could report is that the provider is missing, which says nothing about
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
 * @returns The rendered output and its unmount function.
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
 * @throws Error When it is not present.
 */
function subjectOf(container: ParentNode, options: ConformanceOptions): Rendered {
  return options.subject === undefined ? only(container) : options.subject(container);
}

/**
 * Mounts a component once, reads one thing off the element under test, and unmounts it.
 *
 * The component is unmounted rather than left in the document, so one check cannot read the
 * element another check rendered.
 *
 * @param Component - The component to mount.
 * @param props - The props to mount it with.
 * @param read - The reading to take off the element under test.
 * @param options - The wrapper to mount it inside, and the finder for the element.
 * @returns The reading.
 * @throws Error When the component throws, or the element under test is not present.
 */
function mounted<Held>(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
  read: (element: Rendered) => Held,
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
 * Returns the message from whatever was thrown.
 *
 * @param error - The value that was thrown.
 * @returns Its message, or the value itself when it is not an error.
 */
function reason(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Checks that there is an element to check at all.
 *
 * Every later check assumes there is an element to read, and this one establishes that. A
 * component that throws is reported as throwing rather than as rendering nothing, because the two
 * are different defects and a compound's part missing its provider throws.
 *
 * @param Component - The component to mount.
 * @param props - The props it requires before it renders.
 * @param options - The wrapper to mount it inside, and the finder for the element.
 * @returns The violation, or nothing when there is an element.
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
 * Two different defects. A component that never reads the prop drops the caller's class. One that
 * reads it and assigns it drops its own. Both leave the element styled wrongly, and the second
 * looks correct at the call site.
 *
 * @param Component - The component to check.
 * @param props - The props it requires before it renders.
 * @param options - The wrapper to mount it inside, and the finder for the element.
 * @returns Each violation, empty when it merges.
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
 * The `ref` has to reach the rendered element, and so does an attribute the component does not
 * declare. Both are how a consumer reaches past the component's own interface to the DOM beneath
 * it, which every wrapper in a design system allows.
 *
 * @param Component - The component to check.
 * @param props - The props it requires before it renders.
 * @param options - The wrapper to mount it inside, and the finder for the element.
 * @returns Each violation, empty when it passes both on.
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
 * Checks the two optional parts of the contract.
 *
 * A rule and a spacer take no children, and a component that renders its own element has no
 * `asChild` behaviour. Neither is checked unless the caller declares that the component offers it.
 *
 * @param Component - The component to check.
 * @param props - The props it requires before it renders.
 * @param options - Which of the two to check, the wrapper, and the finder for the element.
 * @returns Each violation, empty when it keeps the ones it was asked about.
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
      (held) => held.tagName.toUpperCase(),
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
 * component that throws, or that renders no element, fails the first check and runs no others,
 * because every later result would restate that failure.
 *
 * A compound's part is checked by naming the provider it needs as `wrapper` and the slot as
 * `subject`. Without the first the part throws. Without the second the element under test would be
 * the wrapper's.
 *
 * @param Component - The component to check.
 * @param options - The optional parts of the contract, and how to reach a component that cannot
 *   render on its own. `ConformanceOptions` documents every member.
 * @returns Each violation, in the order the checks run. Empty for a component that conforms.
 */
export function violations(
  Component: ElementType,
  options: ConformanceOptions = {},
): readonly string[] {
  const props = options.props ?? {};
  const failed = rendering(Component, props, options);

  if (failed !== undefined) return [failed];

  const element = mounted(Component, props, (held) => held.tagName.toUpperCase(), options);
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
