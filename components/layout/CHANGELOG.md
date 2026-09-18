# @stealthscale/component-layout

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`6f479a7`](https://github.com/stealth-scale/config/commit/6f479a76b7c34c879d840e82f709af32749f236f) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-layout: publish the six components that arrange a page
  
  - `Stack` lays its children out along one direction a semantic gap apart, `Grid` lays its entries
    out in columns as `Grid.Root` holding `Grid.Item`, `Container` holds a page to one measure,
    `Frame` holds a picture to one shape, `Divider` draws one line between things and `Spacer` takes
    the room a stack has left over.
  - A layout responds to the room it is in rather than to the width of the window. A grid's
    `columns="fit-sm"` draws as many columns of that measure as there is space for and wraps the rest,
    and a column narrows rather than overflowing where the grid is narrower than the measure. Nothing
    here reads a breakpoint.
  - `Divider` is an `hr`, which a browser gives the separator role, and `Spacer` is hidden from
    assistive technology.
  - The preset under `./theme` registers all six recipes.

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
