/**
 * The `worker` block: how code that runs off the main thread is bundled.
 *
 * Read from the package's own config, like the rest of what a build decides. A worker is part of an
 * application rather than something a workspace shares.
 *
 * Nothing here states `worker.plugins` or `worker.rolldownOptions`. A worker is built by the same
 * pipeline as the page it belongs to, and a repository that needs one of them needs it for a reason
 * this package cannot guess.
 */

export { format } from "#worker/format.ts";
