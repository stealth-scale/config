/**
 * Compiles declarations into routes under a parent, without touching the parent.
 */

import { createElement, type FunctionComponent } from "react";

import { type Evaluate, type LayoutProps, type RouteDeclaration } from "#declaration.ts";
import {
  type AnyRoute,
  createRoute,
  type ErrorRouteComponent,
  lazyRouteComponent,
  notFound,
  Outlet,
} from "#tanstack.ts";

/**
 * Describes what one compilation needs beyond the declarations themselves.
 */
export interface CompileOptions<Condition = unknown> {
  /**
   * Draws a page whose own component threw or failed to load, named per declaration.
   */
  readonly errorComponent?:
    | ((declaration: RouteDeclaration<Condition>) => ErrorRouteComponent)
    | undefined;

  /**
   * Reports whether a route's condition holds. Required where any declaration states one.
   */
  readonly evaluate?: Evaluate<Condition> | undefined;

  /**
   * The layouts a declaration may name.
   */
  readonly layouts?: Readonly<Record<string, FunctionComponent<LayoutProps>>> | undefined;

  /**
   * The route every compiled route hangs under, which this compilation never changes.
   */
  readonly parent: AnyRoute;
}

/**
 * Carries the state one compilation builds up.
 */
interface Building<Condition> {
  /**
   * The layout names in force at each route built here, so a declaration cannot repeat one.
   */
  readonly applied: Map<AnyRoute, readonly string[]>;

  /**
   * Each declaration by its id, so one naming another as its parent finds it.
   */
  readonly byId: ReadonlyMap<string, RouteDeclaration<Condition>>;

  /**
   * The children of each route built here, attached once everything is created.
   */
  readonly children: Map<AnyRoute, AnyRoute[]>;

  /**
   * The route compiled for each declaration.
   */
  readonly compiled: Map<string, AnyRoute>;

  /**
   * The pathless layout routes built under each route, against the layouts they draw.
   */
  readonly frames: Map<AnyRoute, Map<string, AnyRoute>>;

  /**
   * The options this compilation was asked for.
   */
  readonly options: CompileOptions<Condition>;

  /**
   * The ids already used under each route, so a second frame does not collide with the first.
   */
  readonly taken: Map<AnyRoute, Set<string>>;

  /**
   * The routes the caller places itself.
   */
  readonly top: AnyRoute[];
}

/**
 * Reads the page a declaration draws with, loading it on first navigation where it is lazy.
 *
 * @param component - The page, or the importer that resolves to one.
 * @returns The component the route draws.
 */
function pageOf(component: RouteDeclaration["component"]): FunctionComponent {
  return "load" in component ? lazyRouteComponent(component.load, component.export) : component;
}

/**
 * Draws a layout around whatever the route below it draws.
 *
 * @param drawn - The layout component the caller registered.
 * @param options - The options the declaration stated for this layout.
 * @returns A component the pathless route draws.
 */
function framed(
  drawn: FunctionComponent<LayoutProps>,
  options: RouteDeclaration["layoutOptions"],
): FunctionComponent {
  /**
   * Draws the layout around the route below it.
   *
   * @returns The frame, holding the outlet.
   */
  return function Layout() {
    return createElement(drawn, { options }, createElement(Outlet));
  };
}

/**
 * Records a route as a child of another, or as one the caller places itself.
 *
 * @param building - The state this compilation has built up.
 * @param under - The route it hangs under.
 * @param route - The route being placed.
 */
function place<Condition>(building: Building<Condition>, under: AnyRoute, route: AnyRoute): void {
  if (under === building.options.parent) {
    building.top.push(route);

    return;
  }

  const siblings = building.children.get(under) ?? [];

  siblings.push(route);
  building.children.set(under, siblings);
}

/**
 * Returns an id no sibling of a route has used yet.
 *
 * @param building - The state this compilation has built up.
 * @param under - The route the id has to be unique among the children of.
 * @param name - The layout's name, which the id is derived from.
 * @returns The id, suffixed where the plain one is already used.
 */
function freeId<Condition>(building: Building<Condition>, under: AnyRoute, name: string): string {
  const used = building.taken.get(under) ?? new Set<string>();

  building.taken.set(under, used);

  let id = `_${name}`;
  let next = 2;

  while (used.has(id)) {
    id = `_${name}${String(next)}`;
    next += 1;
  }

  used.add(id);

  return id;
}

/**
 * Builds the pathless routes a declaration's layouts need, reusing one already built.
 *
 * @remarks
 *   Two declarations share a frame where they name the same layouts with the same options. A frame
 *   is a route, so two declarations wanting different options need two of them. The key is the JSON
 *   of the names and the options together, which no pair of different chains can produce.
 * @param building - The state this compilation has built up.
 * @param declaration - The declaration whose layouts are being built.
 * @param under - The route the outermost layout hangs under.
 * @returns The route the declaration's own route hangs under.
 * @throws {@link Error} Where a layout nothing provides is named, or where one a route above
 *   already draws is named again.
 */
function framing<Condition>(
  building: Building<Condition>,
  declaration: RouteDeclaration<Condition>,
  under: AnyRoute,
): AnyRoute {
  const names = [...(building.applied.get(under) ?? [])];
  let current = under;

  for (const name of declaration.layout ?? []) {
    const drawn = building.options.layouts?.[name];

    if (drawn === undefined) {
      throw new Error(`The route ${declaration.id} names the layout ${name}, which is absent.`);
    }

    if (names.includes(name)) {
      throw new Error(
        `The route ${declaration.id} names the layout ${name}, which a route above it already draws.`,
      );
    }

    names.push(name);

    const key = JSON.stringify([names, declaration.layoutOptions ?? null]);
    const built = building.frames.get(current) ?? new Map<string, AnyRoute>();

    building.frames.set(current, built);

    const existing = built.get(key);
    const above = current;

    if (existing === undefined) {
      const frame = createRoute({
        component: framed(drawn, declaration.layoutOptions),
        getParentRoute: () => above,
        id: freeId(building, above, name),
      });

      place(building, above, frame);
      built.set(key, frame);
      current = frame;
    } else {
      current = existing;
    }

    building.applied.set(current, [...names]);
  }

  return current;
}

/**
 * Builds the route one declaration compiles to.
 *
 * @param building - The state this compilation has built up.
 * @param declaration - The route being compiled.
 * @param under - The route it hangs under, frames included.
 * @returns The route, drawing the declaration's page under the frames it named.
 */
function routeOf<Condition>(
  building: Building<Condition>,
  declaration: RouteDeclaration<Condition>,
  under: AnyRoute,
): AnyRoute {
  const { errorComponent } = building.options;
  const when = declaration.when;

  return createRoute({
    component: pageOf(declaration.component),
    getParentRoute: () => under,
    path: declaration.path,
    staticData: { declared: { id: declaration.id, navigation: declaration.navigation } },
    ...(errorComponent === undefined ? {} : { errorComponent: errorComponent(declaration) }),
    ...(declaration.search === undefined ? {} : { validateSearch: declaration.search }),
    ...(when === undefined ? {} : { beforeLoad: gate(building, declaration, when) }),
  });
}

/**
 * Builds the check a route runs before it is entered.
 *
 * @remarks
 *   The evaluator is read once here rather than inside the check, so a declaration stating a
 *   condition with no evaluator is refused while the tree is built rather than on a navigation.
 * @param building - The state this compilation has built up.
 * @param declaration - The route being compiled.
 * @param when - The condition the declaration stated.
 * @returns The check, which the route runs before it loads.
 * @throws {@link Error} Where no evaluator was given.
 */
function gate<Condition>(
  building: Building<Condition>,
  declaration: RouteDeclaration<Condition>,
  when: Condition,
): () => void {
  const { evaluate } = building.options;

  if (evaluate === undefined) {
    throw new Error(`The route ${declaration.id} states a condition and no evaluator was given.`);
  }

  return () => {
    // The library's own refusal, which is a value rather than an Error subclass.
    // eslint-disable-next-line typescript/only-throw-error -- see above
    if (!evaluate(when)) throw notFound();
  };
}

/**
 * Compiles one declaration, and whatever it nests under, first.
 *
 * @param building - The state this compilation has built up.
 * @param declaration - The route being compiled.
 * @param seen - The ids being compiled further up this chain, which detects a cycle.
 * @returns The route the declaration compiled to.
 * @throws {@link Error} Where a parent is absent or the parents form a cycle.
 */
function compiledFor<Condition>(
  building: Building<Condition>,
  declaration: RouteDeclaration<Condition>,
  seen: ReadonlySet<string>,
): AnyRoute {
  const already = building.compiled.get(declaration.id);

  if (already !== undefined) return already;

  if (seen.has(declaration.id)) {
    throw new Error(`The route ${declaration.id} nests under itself.`);
  }

  const above = declaration.parent;
  let under = building.options.parent;

  if (above !== undefined) {
    const owner = building.byId.get(above);

    if (owner === undefined) {
      throw new Error(`The route ${declaration.id} names the parent ${above}, which is absent.`);
    }

    under = compiledFor(building, owner, new Set([...seen, declaration.id]));
  }

  const inside = framing(building, declaration, under);
  const route = routeOf(building, declaration, inside);

  place(building, inside, route);
  building.applied.set(route, building.applied.get(inside) ?? []);
  building.compiled.set(declaration.id, route);

  return route;
}

/**
 * Refuses a declaration this package cannot honour, before any of them is compiled.
 *
 * @remarks
 *   A screen maps to a route and a route decides the whole screen, so a page drawn beside another
 *   as a pane has no route to be. The library agrees: `Outlet` takes no name, one route matches per
 *   level, and two outlets in one component draw the same child twice.
 * @param declarations - The routes to compile.
 * @throws {@link Error} Where one states an outlet.
 */
function refuse<Condition>(declarations: ReadonlyArray<RouteDeclaration<Condition>>): void {
  for (const declaration of declarations) {
    if (declaration.outlet !== undefined) {
      throw new Error(
        `The route ${declaration.id} states the outlet ${declaration.outlet}. A screen is whatever its route draws, so there is no pane to draw a second page in.`,
      );
    }
  }
}

/**
 * Indexes declarations by id, refusing a second one that claims an id already taken.
 *
 * @param declarations - The routes to compile.
 * @returns Each declaration against its id.
 * @throws {@link Error} Where two declarations share an id.
 */
function indexed<Condition>(
  declarations: ReadonlyArray<RouteDeclaration<Condition>>,
): ReadonlyMap<string, RouteDeclaration<Condition>> {
  const byId = new Map<string, RouteDeclaration<Condition>>();

  for (const declaration of declarations) {
    if (byId.has(declaration.id)) {
      throw new Error(`Two routes declare the id ${declaration.id}.`);
    }

    byId.set(declaration.id, declaration);
  }

  return byId;
}

/**
 * Compiles declarations into routes under the parent a caller states.
 *
 * @remarks
 *   Pure with respect to the caller. It creates routes and never mutates the parent, so a second
 *   call returns a second set of routes sharing no object with the first. That is what keeps two
 *   routers in one process from reading each other's tree through the library's process-wide cache.
 *   Compile every contributor's declarations in one call. Two calls under one parent cannot see
 *   each other's paths, and `routeMap` reports the collision once the tree is assembled.
 * @param declarations - The routes to compile, in any order.
 * @param options - The parent, and what the declarations may name.
 * @returns The routes to place in the parent's own `addChildren` call.
 * @throws {@link Error} Where two declarations share an id, where one names a parent or a layout
 *   nothing provides, where one names a layout a route above it already draws, where parents form a
 *   cycle, where one states a condition and no evaluator was given, or where one states an outlet.
 */
export function compileRoutes<Condition = unknown>(
  declarations: ReadonlyArray<RouteDeclaration<Condition>>,
  options: CompileOptions<Condition>,
): readonly AnyRoute[] {
  refuse(declarations);

  const building: Building<Condition> = {
    applied: new Map(),
    byId: indexed(declarations),
    children: new Map(),
    compiled: new Map(),
    frames: new Map(),
    options,
    taken: new Map(),
    top: [],
  };

  for (const declaration of declarations) compiledFor(building, declaration, new Set());

  for (const [route, children] of building.children) route.addChildren(children);

  return building.top;
}
