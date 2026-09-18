# @stealthscale/vite-config-specimen

## 0.1.0

### Minor Changes

- [#29](https://github.com/stealth-scale/config/pull/29) [`61d4586`](https://github.com/stealth-scale/config/commit/61d4586ec9b4aab760123ecd13d9e5ed8dbc67ff) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - exclude specimens from package coverage
  
  - `uncounted(files)` contributes `test.omit` for `**/*.specimen.tsx`.
  - `layers()` carries that omission and is the call a package holding specimens makes.
  - `catalogue(options)` is the call an application showing a catalogue makes, and carries what
    `layers(options)` carried.
  - `workspace(files)` carries the omission as well, because the root run counts every package's files
    and reads the root's configuration for what to leave out.

### Patch Changes

- Updated dependencies [[`578a9bb`](https://github.com/stealth-scale/config/commit/578a9bb016cb3e7e6f33c043d1360839e9a55f11), [`c68ac09`](https://github.com/stealth-scale/config/commit/c68ac0960da80e74da7e7444c4b9e89d6380eba2)]:
  - @stealthscale/vite-plugin-specimen@0.1.0
