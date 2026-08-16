<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Autonoma test data

Autonoma runs end-to-end tests against a preview deployment and seeds the realistic
data those tests need through the `POST /api/autonoma` endpoint (`app/api/autonoma/route.ts`).
It never writes raw SQL: each model has a factory in `lib/autonoma/factories.ts` that
creates a row through the app's own creation path (the `savePlace`/`saveBlog`/
`createCategory`/`submitContact`/`saveSettings` inserts and the venue-detail seed shape),
then tears it down again afterwards.

When you add or change a model — or the code that creates it — add or update the matching
factory in `lib/autonoma/factories.ts` (and its entry in the `create` recipe) so the
seeded test data stays in sync with the schema. Keep factories calling the real creation
logic, not raw inserts that skip validation, slugging, derived fields, or relations.
