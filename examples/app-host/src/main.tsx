/**
 * What the page runs once it has loaded.
 */

import { Suspense } from "react";
import { createRoot } from "react-dom/client";

import { Dashboard } from "#dashboard.tsx";
import { endpoints, join } from "#endpoints.ts";
import { Shell } from "#shell.tsx";
import { watching } from "#stale.ts";

/**
 * Where the deployment says the other applications are.
 */
const WHERE = "/remotes.json";

/**
 * Where the host draws.
 */
const root = document.querySelector("#root");

// The other application is deployed on its own schedule, so the chunks this page was told about
// can be gone by the time it asks for them.
watching({
  held: sessionStorage,
  reload: () => {
    globalThis.location.reload();
  },
});

// Registered before anything draws, because a module imported from a remote that was never
// registered fails at the import rather than here.
join(await endpoints(WHERE));

if (root !== null) {
  createRoot(root).render(
    <Shell>
      <Suspense fallback={"Loading the other application."}>
        <Dashboard count={3} />
      </Suspense>
    </Shell>,
  );
}
