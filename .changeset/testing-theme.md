---
"@stealthscale/testing-theme": minor
---

testing-theme: add the theme testing kit

- `violations(theme, options)` checks a theme against the contract and the contrast table: every
  role and every mode, every reference, every extension and its compounds, every text pair at 7:1
  and every line and ring at 3:1.
- `recipeViolations(recipe, options)` reports a color a theme cannot move, a token or a condition
  the preset does not define, a length in px, rem or pt, a color mode, a slot the anatomy does not
  stamp, and `fg.subtle` as a text color.
- `presetViolations(preset, options)` reports a recipe file the preset does not register, a key that
  is not the class name in camel case, and a slot recipe under the wrong section.
- The readers list the classes a recipe emits, read what a recipe declares, read what a rendered
  component drew, and resolve a theme's colors through every reference.
- `slotElement` and `slotClasses` find a part by the `data-slot` a slot binding stamps as well as by
  the `data-part` an anatomy stamps, so a compound component with no machine behind it is read the
  same way.
- `recipe.tokens` reads a token named by one word, so `l9` and `stiky` are reported where the dotted
  form alone was. Nine of the categories a theme states are keyed by one word. A CSS-wide keyword
  and a size a box takes from its content are passed over.
- `recipe.lengths` leaves out what the compiler resolves, so `token(spacing.4, 4px)` is no longer
  read as a hard-coded length.
- The walk reads a key as a property where the compiler resolves one of that name, so a value under
  a range breakpoint such as `smDown` is checked against the property above it. A written list of
  six breakpoint names had left every derived form unchecked.
- `recipeFiles` finds a recipe whose export carries a type, and one whose definition is written on
  the next line, and reads whether it is slotted from the call. One spelling was recognised, and a
  file written any other way was reported as backed by no file.
- `contract.modes` reports a color whose value states no mode the kit knows, an empty object or a
  pair of keys misspelt, which every check passed over.
- `contract.compounds` reports rather than throws where the component's own recipe carries a
  compound matched on a value a class name cannot carry.
- `fonts.installed` resolves a font package from the directory the specification names and reports
  nothing without one, as the listing check does. It resolved from the working directory, so the
  answer depended on where the run was started.
- `publishedRecipes(...presets)` maps every recipe the component packages register to its key, for
  `options.recipes`. A theme specification that passed a list of names left the compound check out,
  because the check needs the recipes themselves.
- `variantClass`, `slotClass` and `slotVariantClass` write the naming scheme through
  `@stealthscale/pandacss-naming`, so `variantClass("button", "size", "lg")` returns `button--lg`
  and `variantClass("button", "loading", true)` returns `button--loading`, and the kit holds the
  separator and the theme attribute equal between the design-system package and the build plugin.
