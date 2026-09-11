// By relative path, not by name: this is the package being configured, so the condition that
// resolves it to its source is the one this file is loading. The node tier rather than the bare
// kernel, because a package that states how everything else is tested is tested the same way.
import { pack } from "./src/index.ts";
import { defineConfig } from "./src/preset/node.ts";

export default defineConfig(import.meta.dirname, {
  extends: [pack.published(import.meta.dirname)],
});
