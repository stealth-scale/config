/**
 * What the page runs when this application is opened on its own rather than loaded by a host.
 */

import { mount } from "#mount.ts";

/**
 * Where the application draws when it owns the page.
 */
const root = document.querySelector("#root");

if (root !== null) mount(root, 3);
