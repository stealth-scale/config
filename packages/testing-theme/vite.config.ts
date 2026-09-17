/**
 * Builds the theme testing kit, packed for Node.
 *
 * @remarks
 *   The kit straddles two runtimes. It reads a package's source off the filesystem and resolves a
 *   font package, which is Node, and it reads the classes on a rendered element, which needs the
 *   DOM types the web tier carries and the node tier does not. So the web tier builds it and the
 *   packer is told the platform, rather than reporting every Node builtin as unresolved.
 */

import { pack } from "@stealthscale/vite-config";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [pack.platform("node")] });
