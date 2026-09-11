/**
 * Amounts of money, kept as whole units of the smallest denomination.
 */

/**
 * An amount, in the smallest unit the currency has.
 */
export interface Amount {
  /**
   * How many of the smallest unit. Negative for what is owed.
   */
  cents: number;

  /**
   * Which currency, as its three-letter code.
   */
  currency: string;
}

/**
 * Adds two amounts of the same currency.
 *
 * Kept in the smallest unit rather than as a fraction, because a tenth cannot be written exactly in
 * binary and adding a hundred of them is off by enough to show up on an invoice.
 *
 * @param one - The first amount.
 * @param other - The second amount.
 * @returns The total.
 * @throws Error Where the two are in different currencies, which have no common total.
 */
export function added(one: Amount, other: Amount): Amount {
  if (one.currency !== other.currency) {
    throw new Error(
      `added() cannot total ${one.currency} and ${other.currency}. Two currencies have no sum ` +
        "until something says what one is worth in the other, and nothing here knows that.",
    );
  }

  return { cents: one.cents + other.cents, currency: one.currency };
}
