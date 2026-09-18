/**
 * Carries the node a subtree is rooted in, and reads it back.
 */

import { createContext, use } from "react";

/**
 * A document, a shadow root, or any other node a subtree can be rooted in.
 */
export type RootNode = Document | Node | ShadowRoot;

/**
 * Returns the node a subtree is rooted in.
 */
export type GetRootNode = () => RootNode;

/**
 * Returns the page's own document, which is what a subtree outside every provider is rooted in.
 */
export const PAGE: GetRootNode = () => globalThis.document;

/**
 * Carries the getter every component below a provider reads.
 *
 * @remarks
 *   The default is the page's own document rather than undefined, so a component reads a getter
 *   whether or not an application mounted a provider. Only an application inside an iframe or a
 *   shadow root has anything to state.
 */
export const RootNodeContext = createContext<GetRootNode>(PAGE);

/**
 * The node type the DOM gives a document, which is what `Node.DOCUMENT_NODE` names.
 *
 * @remarks
 *   The number rather than `instanceof Document`. A document built by `createHTMLDocument`, and any
 *   document reached across a realm, is not an instance of the global `Document`, so that test
 *   would send it to its owner and land back on the page.
 */
const DOCUMENT_NODE = 9;

/**
 * Returns the getter for the node the subtree is rooted in.
 *
 * @remarks
 *   The getter rather than the node, because that is the shape a Zag machine's `getRootNode` option
 *   takes and the shape its `Portal` takes, so a component hands it straight on.
 */
export function useRootNode(): GetRootNode {
  return use(RootNodeContext);
}

/**
 * Returns the document a node belongs to.
 *
 * @remarks
 *   A shadow root is not a document, so its owner is returned instead. A plain function rather than
 *   a hook alone, because an effect that writes to `documentElement` has to resolve the node when
 *   it runs rather than hold a document across a render.
 * @param node - The node to resolve.
 */
export function documentOf(node: RootNode): Document {
  // A document owns no document and every other node owns one, so exactly one side is a Document.
  // Neither fact is in the type.
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
  return (node.nodeType === DOCUMENT_NODE ? node : node.ownerDocument) as Document;
}

/**
 * Returns the document the subtree is rooted in.
 */
export function useEnvironmentDocument(): Document {
  return documentOf(useRootNode()());
}
