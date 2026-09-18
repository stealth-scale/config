/**
 * Draws one member of a generated form: a field through its renderer, a group as a fieldset or
 * a layout, and a repeat group once per item.
 */

import { type ReactElement } from "react";

import { useFormContext } from "#contexts.ts";
import { FieldMember } from "#field-member.tsx";
import { memberKey } from "#presentation-of.ts";
import { type Group, isGroup, type Member as Placed } from "#presentation.ts";
import { describedForm } from "#registry.ts";
import { RepeatGroup } from "#repeat-group.tsx";
import { type Schema } from "#schema.ts";
import { type Translate } from "#translate.ts";
import { useWords, type Words } from "#words.ts";

/**
 * Describes what a member of a generated form is given.
 */
export interface MemberProps {
  /**
   * The indices of the items of the repeat groups around the member, outermost first.
   */
  readonly indices: readonly number[];

  /**
   * The member: a path, or a group of more.
   */
  readonly member: Placed;

  /**
   * The schema resolved against the values in hand.
   */
  readonly resolved: Schema;
}

/**
 * Resolves the legend of a group: the catalogue's words for its name, the words under another
 * identifier it names, or nothing where it draws no fieldset.
 *
 * @remarks
 *   A group whose legend is `true` and that has no name draws no fieldset, because there is no
 *   name to derive the words from.
 */
function legendOf(group: Group, words: Words, translate: Translate): string | undefined {
  if (typeof group.legend === "string") {
    return translate(group.legend, { defaultValue: group.legend });
  }

  return group.legend === true && group.name !== undefined ? words.legend(group.name) : undefined;
}

/**
 * Draws one member of a generated form.
 *
 * @remarks
 *   A group draws its members through this component again, bound to the item given where the
 *   group is inside a repeat group.
 */
export function Member({ indices, member, resolved }: MemberProps): null | ReactElement {
  const form = useFormContext();
  const { layouts, translate } = describedForm(form);
  const words = useWords();

  if (!isGroup(member)) {
    return <FieldMember indices={indices} path={member} resolved={resolved} />;
  }

  /**
   * Draws the group's members, bound to the item at the indices given.
   */
  const draw = (at: readonly number[]): ReactElement[] =>
    member.of.map((child) => (
      <Member indices={at} key={memberKey(child)} member={child} resolved={resolved} />
    ));
  const legend = legendOf(member, words, translate);

  if (member.repeat !== undefined) {
    return (
      <RepeatGroup
        draw={draw}
        group={member}
        indices={indices}
        legend={legend}
        repeat={member.repeat}
      />
    );
  }

  const { Group: Layout } = layouts;

  return (
    <Layout
      closed={member.closed}
      columns={member.columns}
      direction={member.direction}
      legend={legend}
    >
      {draw(indices)}
    </Layout>
  );
}
