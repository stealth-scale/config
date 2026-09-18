/**
 * Which node a subtree is rooted in.
 *
 * A portal attaches to it and a measurement is taken against it, and inside an iframe or a shadow
 * root that is not the page's own document. Rendered outermost, because everything below is placed
 * and measured against whatever this names.
 *
 * @packageDocumentation
 */

export {
  documentOf,
  type GetRootNode,
  type RootNode,
  RootNodeContext,
  useEnvironmentDocument,
  useRootNode,
} from "#context.ts";
export { EnvironmentProvider, type EnvironmentProviderProps } from "#provider.tsx";
