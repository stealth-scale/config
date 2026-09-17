---
"@stealthscale/hooks": minor
---

hooks: add the React hooks a component reads the page with

- `useConst` builds a value once and returns the same one on every render after it, for anything
  whose identity a caller compares.
- `useLiveRef` points a ref at the value this render was given, written during the render so a
  reader that runs before the effects do sees it.
- `useCallbackRef` returns a stable function calling the latest callback, for a handler that would
  otherwise re-run an effect on every render.
- `useSafeLayoutEffect` runs a layout effect in a browser and the plain effect on a server.
  `layoutEffect(document)` makes the choice and is what a specification drives.
- `useControllableState` takes the value from the caller where the caller states one and holds it
  otherwise, decided on every render so a caller that starts driving partway through is followed.
- `useMediaQuery` reads whether each query matches and re-reads all of them when one changes. The
  queries are encoded as JSON for the effect's dependency, which keeps a query holding a comma in
  one piece.
- `useCoarsePointer` reads whether the main pointer is a finger.
- `useIsOverflowing` watches an element and reports whether its content is cut off on each axis,
  measured again on a resize, a content change, a parent resize and after the fonts load.
- `useStickyOffsets` sets a custom property on each sticky band holding the height of the bands
  above it, and one on the column holding the height of all of them. Its effect depends on the
  options encoded, so a caller writing the object inline does not rebuild the observers on every
  render.
- `useMatrixCrosshair` lights the row and column under the pointer in a grid, written through the
  DOM because a matrix of a few hundred items either way is tens of thousands of cells.
- `useAnnounce` says a message to a screen reader through one shared region per politeness, with a
  frame's messages joined by `speakable`.

`useLiveRef`, `useCallbackRef` and `useControllableState` carry the `"use no memo"` directive. Each
one does on purpose what the React Compiler refuses to compile, and the directive turns a refusal
the build would stop on into a decision the source records.

The package peers on React alone. The three hooks that wrap the behaviour library and the two that
read the viewport provider are not here, so a consumer of any hook installs React and nothing else.
