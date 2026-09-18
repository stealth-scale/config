/**
 * States who is reading, and what a route may ask about them.
 */

/**
 * The questions a route may ask before it is routed at all.
 *
 * @remarks
 *   A condition is whatever language an application writes one in. The foundation states nothing
 *   about it, and takes an evaluator that reads whichever language this one chose.
 */
export type Condition = Permitted | SignedIn;

/**
 * Asks that the reader holds a permission.
 */
export interface Permitted {
  /**
   * Which kind of condition this is.
   */
  readonly kind: "permission";

  /**
   * The permission the reader has to hold.
   */
  readonly permission: string;
}

/**
 * Asks that the reader has signed in.
 */
export interface SignedIn {
  /**
   * Which kind of condition this is.
   */
  readonly kind: "signedIn";
}

/**
 * The reader a condition is asked about.
 */
export interface Session {
  /**
   * The permissions they hold.
   */
  readonly permissions: readonly string[];

  /**
   * Whether they have signed in.
   */
  readonly signedIn: boolean;
}

/**
 * The reader before anybody signs in.
 */
export const ANONYMOUS: Session = { permissions: [], signedIn: false };

/**
 * Reports whether a condition holds for one session.
 *
 * @param session - Who is reading.
 * @param when - The question the route asked.
 * @returns Whether the route is routed for them.
 */
export function holds(session: Session, when: Condition): boolean {
  return when.kind === "signedIn"
    ? session.signedIn
    : session.permissions.includes(when.permission);
}
