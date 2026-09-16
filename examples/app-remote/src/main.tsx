/**
 * Starts this application on the page it gets when it is opened on its own rather than loaded.
 *
 * @remarks
 *   This entry is what makes the remote a working application in its own right: it can be run, and
 *   specified, without a host. A host never reaches this file, and calls {@link mount} instead.
 */

import { mount } from "#mount.ts";

/**
 * Finds the element this application draws into, or null on a page without one.
 */
const root = document.querySelector("#root");

if (root !== null) mount(root, 3);
