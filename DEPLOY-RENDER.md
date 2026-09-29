# CyVar AI on Render

`render.yaml` creates one Docker web service and one managed PostgreSQL 17
database in Singapore. The frontend and backend share the web service's public
HTTPS address. The original local and Railway configurations remain available.

## Publish

1. Sign in to Render and connect the GitHub account containing this repository.
2. Choose **New > Blueprint**, select this repository, and use `render.yaml`.
3. Review the two **Free** resources and deploy the Blueprint.
4. Wait for the web service to become live, then open its `onrender.com` URL.

The backend waits for the database, creates the existing model tables, and loads
the bundled synthetic snapshot into an empty database. Imports are transactional
and serialized across overlapping starts. Existing rows are retained on every
redeploy. Database credentials are injected by Render and never enter the source.

The demo includes 3 services, 6 assets, 7 controls, 9 software inventory entries,
and 6 vulnerabilities. No local PostgreSQL connection or Ollama installation is
needed by the cloud service.

## Copilot

`LLM_PROVIDER=none` provides the existing immediate database/reference answers.
Arbitrary AI generation requires a hosted provider: set `LLM_PROVIDER=groq`,
`GROQ_API_KEY`, and optionally `GROQ_MODEL` in Render's service environment.
No API key is included, and no live hosted-model response is claimed as tested.

## Free-plan limits

Render's free web service sleeps after 15 minutes without incoming traffic;
waking it typically takes about a minute. Open the demo before presenting.
Its free PostgreSQL instance expires after 30 days. A paid web instance removes
idle sleeping, and a paid database removes the free database's expiry; changing
plans incurs charges and is a separate account decision.

## Check after deployment

- `/` and `/copilot` load the frontend.
- `/api/health` reports a healthy database.
- `/api/assets` and `/api/vulnerabilities` each report 6 records.
- Risk, ML, simulation, optimization, and suggested Copilot questions respond.

See [Render Blueprints](https://render.com/docs/infrastructure-as-code) and
[free service limits](https://render.com/docs/free).
