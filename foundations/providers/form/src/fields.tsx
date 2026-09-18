/**
 * Draws the fields of a form built from a schema: every member of its presentation, one step of
 * it, or the members given, with the region the form's own errors are read from.
 */

import { type ReactElement } from "react";

import { useFormContext } from "#contexts.ts";
import { Member } from "#member.tsx";
import { leafPaths, memberKey, stepOf } from "#presentation-of.ts";
import { type Member as Placed } from "#presentation.ts";
import { useDescribedForm } from "#registry.ts";
import { RootErrors } from "#root-errors.tsx";
import { Stepper } from "#stepper.tsx";
import { useResolved } from "#use-resolved.ts";

/**
 * Describes what the fields of a form are given.
 */
export interface FieldsProps {
  /**
   * The members to draw, in place of the presentation's.
   */
  readonly of?: readonly Placed[] | undefined;

  /**
   * The name of the step to draw, in place of every step with the controls between them.
   */
  readonly step?: string | undefined;
}

/**
 * Draws the fields of the form in scope, which `useSchemaForm` built.
 *
 * @remarks
 *   Given nothing, the component draws the presentation's members in order, or its steps with
 *   the controls between them, or every field outside an array where the presentation states
 *   neither, under the region the form's own errors are read from. Given `of`, it draws those
 *   members and no region, so a form written by hand draws one field on a condition beside the
 *   fields it writes itself, as often as it likes. Given `step`, it draws that step's members
 *   alone, for a page that moves between steps itself. Each member is drawn over the schema
 *   resolved against the values in hand.
 * @throws {@link Error} When the form in scope was not built with `useSchemaForm`, or `step`
 *   names a step the presentation lacks.
 */
export function Fields({ of, step }: FieldsProps): ReactElement {
  const form = useFormContext();
  const { engine, presentation, schema } = useDescribedForm(form);
  const resolved = useResolved();
  const region = of === undefined ? <RootErrors /> : null;

  if (of === undefined && step === undefined && presentation.steps !== undefined) {
    return (
      <>
        {region}
        <Stepper resolved={resolved} steps={presentation.steps} />
      </>
    );
  }

  const members =
    of ??
    (step === undefined
      ? (presentation.of ?? leafPaths(engine.paths(schema)))
      : stepOf(presentation, step).of);

  return (
    <>
      {region}
      {members.map((member) => (
        <Member indices={[]} key={memberKey(member)} member={member} resolved={resolved} />
      ))}
    </>
  );
}
