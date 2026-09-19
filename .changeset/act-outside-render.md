---
"@stealthscale/vite-config-react": minor
"@stealthscale/vite-config": minor
---

vite-config-react: fail a test that updates a component outside act

- React reports an update made outside `act` on `console.error`. A passing run wrote it to stderr,
  no gate read it, and the runner does not always print it, so grepping a captured run reported none
  while the warnings were still being emitted.
- The shared setup file now records that one message and throws in `afterEach`, naming the
  component. A test that renders a component built on a state machine and asserts before the machine
  settles is reading a half-drawn tree, which is a defect rather than noise.
- Only that message is caught. A specification that drives a component into throwing makes React
  report the throw the same way, and that is a case rather than a fault.

vite-config: excuse a fixture from the cap on dependencies

- `lint.composed` turns `import/max-dependencies` off for `**/*.fixtures.ts` and
  `**/*.fixtures.tsx`, beside `lint.barrelled` and under a reason of its own.
- A fixture builds the component its specifications measure, so it imports every part that component
  is composed of. Its count is the size of the component rather than a sign that one module does too
  much, and a fixture held to the cap pushes the composition back into the specifications that were
  meant to share it.
