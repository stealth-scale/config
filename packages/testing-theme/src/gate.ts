/**
 * Runs the checks a specification leaves standing and reports what each found.
 *
 * @remarks
 *   Every gate in this package reports the same way: a skip without a reason first, then each
 *   violation opening with the name of the check that reported it. The checks themselves take
 *   different subjects, so a caller hands over a call per check rather than a subject, and the
 *   signature of each check stays where the check is written.
 */

/**
 * Describes what a specification states about which checks to leave out.
 *
 * @typeParam Check - The names of the checks the gate offers.
 */
export interface Skippable<Check extends string> {
  /**
   * The checks to leave out, each with a reason a reviewer can weigh.
   */
  skip?: Readonly<Partial<Record<Check, string>>> | undefined;
}

/**
 * Reports a skip that gives no reason.
 */
function unreasoned<Check extends string>(stated: Skippable<Check>): readonly string[] {
  return Object.entries(stated.skip ?? {})
    .filter(([, because]) => String(because).trim() === "")
    .map(([check]) => `skip of ${check} gives no reason`);
}

/**
 * Runs every check the specification leaves standing, in the order they are listed.
 *
 * @typeParam Check - The names of the checks the gate offers.
 * @param runners - Each check against the call that performs it.
 * @param stated - The specification's own options, read for its skips.
 * @returns Each violation, opening with the check that reported it.
 */
export function gated<Check extends string>(
  runners: ReadonlyArray<readonly [Check, () => readonly string[]]>,
  stated: Skippable<Check>,
): readonly string[] {
  const reported = runners
    .filter(([check]) => stated.skip?.[check] === undefined)
    .flatMap(([check, run]) => run().map((violation) => `${check}: ${violation}`));

  return [...unreasoned(stated), ...reported];
}
