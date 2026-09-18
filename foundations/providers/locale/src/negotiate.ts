/**
 * Picks the locale to answer in: what a request asked for, matched against what an application
 * offers.
 *
 * @remarks
 *   The matcher is ECMA-402's lookup algorithm. It truncates the requested tag until it names
 *   something on offer.
 */

import { canonical, chain, type Tag, widenedChain } from "#tags.ts";

/**
 * Maps each canonical tag an application offers to the spelling the application used.
 */
type Offers = ReadonlyMap<Tag, Tag>;

/**
 * One entry of an `Accept-Language` header.
 */
export interface Preference {
  /**
   * How much the client wants the tag, above 0 and up to 1. A header that names no quality means 1.
   */
  readonly quality: number;

  /**
   * The canonical tag the client asked for.
   */
  readonly tag: Tag;
}

/**
 * Reads how much a client wants a tag from the `q` parameter beside it.
 *
 * @remarks
 *   A parameter that names no number leaves the tag fully wanted, so `en;` and `en;q=` both mean
 *   `en`.
 * @param parameter - The text after the tag's semicolon, such as `q=0.8`.
 * @returns The quality between 0 and 1, and 1 where the parameter names none.
 */
function qualityOf(parameter?: string): number {
  const named = parameter?.trim().replace(/^q=/u, "").trim() ?? "";

  if (named === "") return 1;

  const value = Number(named);

  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : 1;
}

/**
 * Reads an `Accept-Language` header into the tags a client will accept, most wanted first.
 *
 * @remarks
 *   A string with no canonical form is dropped rather than carried as something nothing can match,
 *   and so is the wildcard `*`, which names no locale. A tag at `q=0` is dropped too: RFC 9110
 *   gives that quality the meaning "not acceptable", so the client named the tag to refuse it.
 * @param header - The header as it arrived, such as `en-GB,en;q=0.9,nl;q=0.8`.
 * @returns The tags, highest quality first and in the header's own order where two match. Empty
 *   when the header names nothing usable.
 */
export function preferences(header?: string): readonly Preference[] {
  if (header === undefined || header.trim() === "") return [];

  return header
    .split(",")
    .map((entry): Preference | undefined => {
      const semicolon = entry.indexOf(";");
      const named = semicolon === -1 ? entry : entry.slice(0, semicolon);
      const parameter = semicolon === -1 ? undefined : entry.slice(semicolon + 1);
      const canonicalised = canonical(named.trim());

      return canonicalised === undefined
        ? undefined
        : { quality: qualityOf(parameter), tag: canonicalised };
    })
    .filter((one): one is Preference => one !== undefined && one.quality > 0)
    .toSorted((left, right) => right.quality - left.quality);
}

/**
 * Keys what an application offers by canonical tag, keeping the spelling it used.
 *
 * @remarks
 *   The spelling is kept because that string names a catalogue. Where two entries canonicalise the
 *   same, the first wins, so the application's own order decides.
 * @param available - The tags the application offers.
 */
function offers(available: readonly string[]): Offers {
  const offered = new Map<Tag, Tag>();

  for (const tag of available) {
    const canonicalised = canonical(tag);

    if (canonicalised !== undefined && !offered.has(canonicalised)) {
      offered.set(canonicalised, tag);
    }
  }

  return offered;
}

/**
 * Keys the same offers by every step of their widened chain, so both sides meet at a shared depth.
 *
 * @remarks
 *   An offer keyed by its full widened tag alone is reached only by a request that widens to the
 *   same region. `zh-Hant` widens to `zh-Hant-TW` and a request for `zh-HK` widens to `zh-Hant-HK`,
 *   so the two never meet at full depth. Keying `zh-Hant` and `zh` as well lets them meet at the
 *   script.
 * @param offered - The offers, as `offers` keyed them.
 */
function widenedOffers(offered: Offers): Offers {
  const wide = new Map<Tag, Tag>();

  for (const [canonicalised, written] of offered) {
    for (const step of widenedChain(canonicalised)) {
      if (!wide.has(step)) wide.set(step, written);
    }
  }

  return wide;
}

/**
 * Runs ECMA-402's lookup over the requested tags: the first whose chain names an offer wins.
 *
 * @param requested - The tags asked for, most wanted first.
 * @param offered - The offers to match against.
 * @param widen - Widens each requested tag before truncating it, which the second pass sets.
 * @returns The offer as the application spelled it, or undefined when none of the tags names one.
 */
function lookup(requested: readonly string[], offered: Offers, widen: boolean): Tag | undefined {
  for (const tag of requested) {
    for (const step of widen ? widenedChain(tag) : chain(tag)) {
      const match = offered.get(step);

      if (match !== undefined) return match;
    }
  }

  return undefined;
}

/**
 * Picks the first offered locale a request would accept.
 *
 * @remarks
 *   Each requested tag is truncated in turn, `en-GB` then `en`, and the first that names an offer
 *   wins. That is ECMA-402's lookup matcher, and it reaches `nl` from `nl-BE`.
 *   Where truncation finds nothing, both sides are widened to their likely script and region and
 *   matched over every step, so they meet at a shared depth: `zh` reaches `zh-Hans`, `zh-HK`
 *   reaches `zh-Hant`, and `en-GB` reaches `en-US`.
 * @param requested - The tags asked for, most wanted first, as `preferences` orders them.
 * @param available - The tags the application offers.
 * @param fallback - The tag to answer with when nothing matches, returned as given.
 */
export function negotiate(
  requested: readonly string[],
  available: readonly string[],
  fallback: string,
): Tag {
  const offered = offers(available);

  return (
    lookup(requested, offered, false) ?? lookup(requested, widenedOffers(offered), true) ?? fallback
  );
}
