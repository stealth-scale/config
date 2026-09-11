import { preset } from "@stealthscale/config-react";

import { lint, run, staged, test } from "./packages/config-vite/src/index.ts";
import { defineConfig } from "./packages/config-vite/src/preset/node.ts";

export default defineConfig(import.meta.dirname, {
  extends: [
    run.cache(),
    run.ci(),
    staged.checked(),
    staged.formatted(),
    test.projects(),

    lint.relax({
      because:
        "the rule is written for `window.postMessage`, whose second argument is the origin " +
        "allowed to receive the message. A worker's takes a list of objects to transfer instead, " +
        "so there is no origin to pass and the rule asks for an argument that does not exist",
      files: ["**/*.worker.ts", "**/*.worker-client.ts"],
      rules: { "unicorn/require-post-message-target-origin": "off" },
    }),

    test.uncounted({
      because:
        "the JSX runtime marks every element call `@__PURE__`, which tells a bundler it may drop " +
        "the call where nothing reads its result. Coverage reads that as a path, and it is one no " +
        "test can take: either the component rendered or it was never rendered at all. A component " +
        "whose root element has more than one child reports one such branch",
      files: ["examples/lib-ui/src/panel.tsx"],
    }),
    preset.workspace(),
  ],
});
