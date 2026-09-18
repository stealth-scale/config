---
"@stealthscale/provider-form": minor
---

Add the form foundation. It publishes the contexts a bound field and a bound form share, the engine
that evaluates a JSON Schema, and `standardOf`, which wraps a schema as the Standard Schema the form
library validates with. It derives the defaults and the message identifiers from a schema, types how
a form is drawn as data, puts the engine, the renderers and the translator in scope through
`FormProvider`, and keeps a form across a refresh with `useDraft`.
