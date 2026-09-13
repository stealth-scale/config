---
"@stealthscale/vite-config": minor
---

Write what a page loads first to three chunks

`build.chunks`, in the application tier, groups every module the entry imports statically into the
React runtime, the other packages and the application, by how often each changes. Nothing in a
module entry runs until its whole static import graph has arrived, so the hundred small files the
bundler writes by default only add requests, and each one is compressed on its own: on the design
system's docs, 119 files at 396 kB gzipped became three at 349 kB, and 118 preload hints became 3. A
route or a page behind a dynamic import stays a chunk of its own.

An application that splits its own takes the layer back by name.
