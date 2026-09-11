/**
 * What is put back between one rendering test and the next.
 *
 * Loaded by the runner rather than imported, through the setup file `test.cleanup` contributes.
 */

import { afterEach } from "vite-plus/test";

afterEach(() => {
  document.body.replaceChildren();
});
