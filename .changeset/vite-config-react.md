---
"@stealthscale/vite-config-react": patch
---

vite-config-react: unmount every rendered root after each test

- `vitest.setup.ts` calls Testing Library's `cleanup` before it empties `document.body`, so an
  effect's cleanup runs and a scroll lock or a listener from one test no longer reaches the next.
- The package peers on `@testing-library/react`.
