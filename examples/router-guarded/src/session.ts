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
 * Who is reading now.
 */
let reader: Session = ANONYMOUS;

/**
 * The callbacks drawing the session, each called when it changes.
 */
const watchers = new Set<() => void>();

/**
 * Returns who is reading now.
 *
 * @remarks
 *   A call rather than a value, because the evaluator asks on every navigation and a value read
 *   while the tree was built would answer for whoever was reading then.
 * @returns The session every condition is asked about.
 */
export function session(): Session {
  return reader;
}

/**
 * Records who is reading now and tells whatever is drawing it.
 *
 * @param next - The session every condition is asked about from now on.
 */
export function signedInAs(next: Session): void {
  reader = next;

  for (const watcher of watchers) watcher();
}

/**
 * Subscribes to the session changing, in the shape `useSyncExternalStore` takes.
 *
 * @param watcher - Called each time the session changes.
 * @returns The call that withdraws the subscription.
 */
export function watchSession(watcher: () => void): () => void {
  watchers.add(watcher);

  return () => {
    watchers.delete(watcher);
  };
}

/**
 * Reports whether a condition holds for one session.
 *
 * @param reading - Who is reading.
 * @param when - The question the route asked.
 * @returns Whether the route is routed for them.
 */
export function holds(reading: Session, when: Condition): boolean {
  return when.kind === "signedIn"
    ? reading.signedIn
    : reading.permissions.includes(when.permission);
}
