/**
 * Totals the amounts a command line carries.
 *
 * @remarks
 *   Every message here is written for somebody reading a terminal, so it says
 *   what was refused and what to type instead.
 */

import { added, type Amount } from "@stealthscale/example-lib-core";

/**
 * Splits one command-line argument into its cents and its currency.
 *
 * @remarks
 *   The last three characters are the currency and everything before them is
 *   the amount, so no separator is allowed between the two. The cents have to
 *   be whole and the currency upper case, which makes `1.50EUR` and `150eur`
 *   both refusals rather than guesses.
 * @throws {@link Error} When the argument is not whole cents followed by three
 * upper-case letters.
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
 * Totals every argument and writes the sum back in the form it read.
 *
 * @remarks
 *   Every argument is parsed before any of them is added, so a list holding one
 *   unreadable argument fails on that argument and never reports a partial
 *   total. The currencies have to match, and an empty list has no currency to
 *   report a zero in, so it is refused rather than answered with `0`.
 * @param held - The arguments, each written as whole cents followed by the
 *   currency, such as `150EUR`.
 * @returns The sum in the same form.
 * @throws {@link Error} When the list is empty, when an argument cannot be
 *   read, or when two arguments name different currencies.
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
