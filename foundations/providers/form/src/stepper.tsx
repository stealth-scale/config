/**
 * Draws a generated form in steps: the step a person is on, and the controls that move between
 * steps.
 */

import { type ReactElement, useEffect, useId, useRef, useState } from "react";

import { useAnyForm } from "#contexts.ts";
import { focusInside } from "#focus.ts";
import { Member } from "#member.tsx";
import { memberKey, memberPaths } from "#presentation-of.ts";
import { type Steps } from "#presentation.ts";
import { useDescribedForm } from "#registry.ts";
import { type Schema } from "#schema.ts";
import { leaveStep } from "#steps.ts";
import { useWords } from "#words.ts";

/**
 * Describes what the stepper is given.
 */
export interface StepperProps {
  /**
   * The schema resolved against the values in hand.
   */
  readonly resolved: Schema;

  /**
   * The steps, in the order they are walked, and which kind they are.
   */
  readonly steps: Steps;
}

/**
 * Draws the step a person is on.
 *
 * @remarks
 *   The form opens on the step its draft was written on, and writes the step into the draft as a
 *   person leaves it. The draft's step is read on every render until a person moves, rather than
 *   once, because a page rendered on a server reads its draft in the render after it hydrates.
 *   A wizard validates a step before a person moves forward, refuses the move where a field of
 *   the step is refused, and moves one step forward at a time, because a step it has not drawn
 *   cannot be validated. Moving back, and moving between tabs, validates nothing. Focus moves
 *   into the step once it is drawn, so a keyboard or screen reader user is not left on a control
 *   that is gone.
 */
export function Stepper({ resolved, steps }: StepperProps): null | ReactElement {
  const form = useAnyForm();
  const { draft, layouts, translate } = useDescribedForm(form);
  const words = useWords();
  const id = useId();
  const [chosen, setChosen] = useState<number>();
  const moved = useRef(false);
  const current =
    chosen ??
    Math.max(
      0,
      steps.of.findIndex((step) => step.name === draft.restored?.step),
    );
  const stepId = `${id}-${String(current)}`;

  useEffect(() => {
    if (!moved.current) return;

    moved.current = false;
    focusInside(stepId);
  }, [stepId]);

  const step = steps.of[current];

  if (step === undefined) return null;

  const kind = steps.kind ?? "wizard";
  const labels = steps.of.map((each) =>
    each.label === undefined
      ? words.step(each.name)
      : translate(each.label, { defaultValue: words.step(each.name) }),
  );

  /**
   * Moves to the step at an index, writes it into the draft, and notes that the step is the one
   * to focus once it is drawn.
   */
  const go = (index: number): void => {
    draft.write(form.state.values, steps.of[index]?.name);
    moved.current = true;
    setChosen(index);
  };

  /**
   * Moves to the step at an index, once the step being drawn lets a person leave it.
   */
  const advance = async (index: number): Promise<void> => {
    if (index < 0 || index >= steps.of.length || index === current) return;

    if (kind === "tabs" || index < current) {
      go(index);

      return;
    }

    if (index > current + 1) return;

    if (await leaveStep(form, memberPaths(step.of))) go(index);
  };

  const { Step: Layout } = layouts;

  return (
    <Layout
      current={current}
      id={stepId}
      kind={kind}
      labels={labels}
      onGo={(index) => void advance(index)}
    >
      {step.of.map((member) => (
        <Member indices={[]} key={memberKey(member)} member={member} resolved={resolved} />
      ))}
    </Layout>
  );
}
