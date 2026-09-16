/**
 * Adds money without reaching for anything a runtime supplies.
 */

/**
 * A sum of money, held as a whole number of minor units.
 *
 * @remarks
 *   Counting in minor units keeps arithmetic exact where a fractional major
 *   unit would not: 0.1 + 0.2 is 3 rather than 0.30000000000000004. A currency
 *   whose minor unit is not a hundredth, such as JPY, is still counted in its
 *   own minor unit, and nothing here divides by 100.
 */
export interface Amount {
  /**
   * The whole number of minor units, negative where the money is owed.
   */
  cents: number;

  /**
   * The ISO 4217 code, in the upper case that code is written in.
   */
  currency: string;
}

/**
 * Sums two amounts of one currency into a third.
 *
 * @remarks
 *   Neither argument is changed, and the result carries the currency both
 *   share. A mixed pair is refused rather than converted, because a conversion
 *   needs a rate and nothing in this package holds one.
 * @throws {@link Error} When the two amounts name different currencies.
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
