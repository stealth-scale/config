/**
 * Publishes the foundation under the subpath every package publishes its preset under, so an
 * application's compiler finds it the same way it finds a component package's recipes: by
 * depending on this package.
 *
 * @packageDocumentation
 */

import { foundation } from "#preset/index.ts";

export default foundation;
