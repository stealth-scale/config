/**
 * Describes a route as a host declares it, rather than as the library builds one.
 */

import { type FunctionComponent, type ReactNode } from "react";

/**
 * Loads a page on first navigation, rather than with the bundle that declared it.
 *
 * @remarks
 *   A wrapper rather than a bare function, because a React component is a function too and nothing
 *   at run time separates one from an importer.
 */
export interface LazyPage {
  /**
   * The export the page is published under. The module's default export where it states none.
   */
  readonly export?: string | undefined;

  /**
   * Imports the module holding the page.
   */
  readonly load: () => Promise<Readonly<Record<string, FunctionComponent>>>;
}

/**
 * Reports one fault a schema found.
 */
export interface SearchIssue {
  /**
   * The fault, in words a person can read.
   */
  readonly message: string;
}

/**
 * Reports that a value was refused, and why.
 */
export interface SearchRefused {
  /**
   * Each fault the schema found.
   */
  readonly issues: readonly SearchIssue[];
}

/**
 * Reports that a value was accepted, and what it read as.
 */
export interface SearchRead {
  /**
   * Nothing, which is how a reader tells an acceptance from a refusal.
   */
  readonly issues?: undefined;

  /**
   * The value, as the schema read it.
   */
  readonly value: unknown;
}

/**
 * Checks a value against a schema, in the shape Standard Schema settled on.
 */
export interface StandardSurface {
  /**
   * Checks a value and returns what it read, or why it refused.
   */
  readonly validate: (
    value: unknown,
  ) => Promise<SearchRead | SearchRefused> | SearchRead | SearchRefused;
}

/**
 * Reads a search string into the values a route draws with.
 *
 * @remarks
 *   Stated structurally rather than by the library's own name, so a declaration carries a validator
 *   from any library that implements Standard Schema without this package depending on any of them.
 */
export interface SearchValidator {
  /**
   * The Standard Schema surface, which is the whole of what the library reads.
   */
  readonly "~standard": StandardSurface;
}

/**
 * Draws a frame around whatever a route below it draws.
 */
export interface LayoutProps {
  /**
   * The route drawn inside the frame, which React supplies.
   */
  readonly children?: ReactNode | undefined;

  /**
   * The options the declaration stated for this layout, passed through untouched.
   */
  readonly options?: Readonly<Record<string, unknown>> | undefined;
}

/**
 * Describes one route a host declares, in the form the compiler takes.
 *
 * @remarks
 *   The condition is generic because this package cannot read a session and does not know the
 *   language conditions are written in. A host states its own and supplies the evaluator that reads
 *   it.
 */
export interface RouteDeclaration<Condition = unknown> {
  /**
   * Draws the page, either directly or loaded on first navigation.
   */
  readonly component: FunctionComponent | LazyPage;

  /**
   * The id a host and a plugin refer to it by, which resolves to a path through the map.
   */
  readonly id: string;

  /**
   * The layouts it is drawn in, outermost first. Drawn bare where it names none.
   */
  readonly layout?: readonly string[] | undefined;

  /**
   * Passed to each layout untouched, for whatever the layout reads.
   */
  readonly layoutOptions?: Readonly<Record<string, unknown>> | undefined;

  /**
   * The menu entry a menu reads, which the compiler writes onto the route without reading.
   */
  readonly navigation?: unknown;

  /**
   * The pane it is drawn in, which this package refuses because it draws no panes.
   */
  readonly outlet?: string | undefined;

  /**
   * Another declaration it nests under, by id. The compiler's own parent where it names none.
   */
  readonly parent?: string | undefined;

  /**
   * The path pattern, relative to the parent, in the library's `$id` form.
   */
  readonly path: string;

  /**
   * A sample of the parameters, which a plugin's own tests open the page at.
   */
  readonly sample?: Readonly<Record<string, string>> | undefined;

  /**
   * Reads the search string this route draws with.
   */
  readonly search?: SearchValidator | undefined;

  /**
   * When it is routed at all. Routed always where it states none.
   */
  readonly when?: Condition | undefined;
}

/**
 * Carries the name a route goes by, and whatever a menu reads off it.
 *
 * @remarks
 *   Written onto the route's `staticData`, which the library hands back on every match. A menu, a
 *   breadcrumb or a telemetry hook therefore reads the name off the page it is drawing rather than
 *   holding a second copy of the list.
 */
export interface DeclaredRoute {
  /**
   * The id the route is named under.
   */
  readonly id: string;

  /**
   * The menu entry the declaration carried, passed through untouched.
   */
  readonly navigation?: unknown;
}

/**
 * Reports whether a route's condition holds for whoever is asking.
 *
 * @remarks
 *   Returning false makes the route a 404, because a route nobody may reach does not exist. An
 *   evaluator wanting anything else, such as sending an unauthenticated person to sign in, throws
 *   the library's own `redirect` instead.
 */
export type Evaluate<Condition = unknown> = (when: Condition) => boolean;
