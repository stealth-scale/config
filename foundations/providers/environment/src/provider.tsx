/**
 * Names the node every component below is placed and measured against.
 */

import { type ReactElement, type ReactNode, useMemo } from "react";

import { type GetRootNode, PAGE, type RootNode, RootNodeContext } from "#context.ts";

/**
 * Describes what {@link EnvironmentProvider} is given.
 */
export interface EnvironmentProviderProps {
  /**
   * The subtree rooted in the node.
   */
  readonly children?: ReactNode | undefined;

  /**
   * The node the subtree is rooted in, or a getter for it. The page's own document where this is
   * absent.
   */
  readonly value?: GetRootNode | RootNode | undefined;
}

/**
 * Puts the node a subtree is rooted in into scope for everything below it.
 *
 * @remarks
 *   A portal appended to the page's document from inside a shadow root loses the shadow root's
 *   styles, and a measurement taken against the page inside an iframe reads the wrong box. An
 *   application rendered in either states which node it is in here, and nothing below has to know.
 * @param props - The node and the subtree. `EnvironmentProviderProps` documents both.
 */
export function EnvironmentProvider({ children, value }: EnvironmentProviderProps): ReactElement {
  const getRootNode = useMemo<GetRootNode>(() => {
    if (value === undefined) return PAGE;

    return typeof value === "function" ? value : (): RootNode => value;
  }, [value]);

  return <RootNodeContext value={getRootNode}>{children}</RootNodeContext>;
}
