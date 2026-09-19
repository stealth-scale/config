---
"@stealthscale/component-actions": patch
"@stealthscale/component-data": patch
"@stealthscale/component-feedback": patch
"@stealthscale/component-forms": patch
"@stealthscale/component-surfaces": patch
"@stealthscale/component-typography": patch
---

components: emit a rule for every status a component can be handed

- Every recipe with a `status` axis now carries `statusEmitted()` under `staticCss`: `Button`,
  `Badge`, `Alert`, `Checkbox`, `Field`, `Fieldset`, `Input`, `Switch`, `Textarea`, `Card`,
  `Blockquote`, `Code`, `Kbd` and `Mark`.
- The compiler emits a rule for a value it reads from a literal in an application's source. An
  application writes `status={row.status}` rather than `status="error"`, so the compiler read a name
  it could not follow. The runtime still wrote the class, and the component drew in its default
  palette while reporting an error.
- Measured on the single-theme example, which writes `status="error"` and the other three nowhere:
  the stylesheet held a rule for `error` alone before, and for all four after, at 0.19 kB over the
  wire.
- `recipe.emitted` in the theme's test kit reports a recipe that offers a status and lists none, so
  a new one cannot be written without it.
