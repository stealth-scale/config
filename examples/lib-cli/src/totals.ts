/**
 * Turning what was typed at a console into a total.
 */

import { added, type Amount } from "@stealthscale/example-lib-core";

/**
 * Reads one argument as an amount.
 *
 * @param held - One argument, written as `<cents><currency>`: `150EUR`.
 * @returns The cents and the currency it was written in.
 * @throws Error Where the argument is not one.
 */
function amount(held: string): Amount {
  const currency = held.slice(-3);
  const cents = held.slice(0, -3);

  if (!/^-?\d+$/u.test(cents) || !/^[A-Z]{3}$/u.test(currency)) {
    throw new Error(
      `tally cannot read ${held}. An amount is written as 150EUR: whole cents, then the currency.`,
    );
  }

  return { cents: Number(cents), currency };
}

/**
 * Totals every amount that was typed.
 *
 * @param held - The arguments, each an amount.
 * @returns The total, written the same way it was read.
 * @throws Error Where nothing was typed, or one of the arguments is not an amount.
 */
export function tally(held: readonly string[]): string {
  const amounts = held.map((one) => amount(one));
  const first = amounts[0];

  if (first === undefined) {
    throw new Error(
      "tally was given nothing to total. Pass one amount or more: tally 150EUR 275EUR.",
    );
  }

  const total = amounts.slice(1).reduce((so, far) => added(so, far), first);

  return `${String(total.cents)}${total.currency}`;
}
