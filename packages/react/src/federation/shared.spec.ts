import { expect, test } from "vite-plus/test";

import { installed, shared } from "#federation/shared.ts";

test("shares React, two copies of which share no hooks", () => {
  expect(shared()["react"]?.singleton).toBe(true);
});

test("shares the renderer, two of which mean two roots over one tree", () => {
  expect(shared()["react-dom"]?.singleton).toBe(true);
});

test("shares nothing else, the rest being each application's own", () => {
  expect(Object.keys(shared()).toSorted()).toEqual(["react", "react-dom"]);
});

test("counts a whole major as the same React, a host being on a later patch than a remote", () => {
  expect(shared("19.3.0")["react"]?.requiredVersion).toBe("^19.0.0");
});

test("follows the version installed rather than one written down here", () => {
  expect(shared("20.1.4")["react"]?.requiredVersion).toBe("^20.0.0");
});

test("holds both packages to the same range, which is what makes them one React", () => {
  const held = shared("19.3.0");

  expect(held["react"]?.requiredVersion).toBe(held["react-dom"]?.requiredVersion);
});

test("reads the tree when nothing is passed, so a workspace upgrade needs no edit here", () => {
  expect(shared()["react"]?.requiredVersion).toMatch(/^\^\d+\.0\.0$/u);
});

test("reads React's version from the manifest it was pointed at", () => {
  expect(installed(() => ({ version: "19.3.0" }))).toBe("19.3.0");
});

test("refuses a manifest stating no version, which is React not being installed", () => {
  expect(() => installed(() => ({}))).toThrow(/could not read React's version/u);
});

test("refuses whatever else a missing manifest resolves to", () => {
  expect(() => installed(() => "not a manifest")).toThrow(/could not read React's version/u);
});
