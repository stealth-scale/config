import { preset as react } from "@stealthscale/vite-config-react";

import { fmt, lint, test } from "./packages/vite-config/src/index.ts";
import { defineConfig } from "./packages/vite-config/src/preset/node.ts";
import { workspace } from "./packages/vite-config/src/preset/workspace.ts";

export default defineConfig(import.meta.dirname, {
  extends: [
    workspace(),
    react.workspace(),

    lint.relax({
      because:
        "the rule is written for `window.postMessage`, whose second argument is the origin " +
        "allowed to receive the message. A worker's takes a list of objects to transfer instead, " +
        "so there is no origin to pass and the rule asks for an argument that does not exist",
      files: ["**/*.worker.ts", "**/*.worker-client.ts"],
      rules: { "unicorn/require-post-message-target-origin": "off" },
    }),

    fmt.skip({
      because:
        "changesets writes it from the changeset files and rewrites it on every release, so a " +
        "wrapped changelog is undone by the next `changeset version` and the diff it leaves is " +
        "nobody's to read. The prose is already wrapped where it is written, in the changeset",
      files: ["**/CHANGELOG.md"],
    }),

    lint.relax({
      because:
        "the rule keeps a component library navigable, where a file is found by the component it " +
        "declares. A specification's components are fixtures rather than library components: they " +
        "are read beside the test that drives them, and splitting each into a file of its own " +
        "puts the fixture further from the assertion it exists for",
      files: ["**/*.spec.tsx"],
      rules: { "react/no-multi-comp": "off" },
    }),

    test.uncounted({
      because:
        "the JSX runtime marks every element call `@__PURE__`, which tells a bundler it may drop " +
        "the call where nothing reads its result. Coverage reads that as a path, and it is one no " +
        "test can take: either the component rendered or it was never rendered at all. A component " +
        "whose root element has more than one child reports one such branch",
      files: ["examples/lib-ui/src/panel.tsx"],
    }),
  ],
});
