# Dream Portal QA

Playwright and TypeScript automation for the Dream Portal assignment:
`https://arjitnigam.github.io/myDreams/`

## Coverage

- Home page loading message appears before the portal is revealed after approximately three seconds.
- The `My Dreams` control opens `dreams-diary.html` and `dreams-total.html` in new tabs.
- Diary contains exactly 10 complete rows and only `Good` or `Bad` types.
- Recurring dreams are calculated from diary data and verified as `Flying over mountains` and `Lost in maze`.
- Summary verifies Good `6`, Bad `4`, Total `10`, and Recurring `2`.
- Optional Ollama validation classifies each unique dream name and compares it with the diary.

## Local Setup

Requirements: Node.js 22 or newer.

```powershell
npm ci
npx playwright install chromium
npm test
```

Useful commands:

```powershell
npm run typecheck
npm run test:headed
npm run report
```

The default test run is deterministic and needs no credentials. Screenshots, traces, and videos are stored with Playwright results; the HTML report is written to `playwright-report/`.

## Optional AI Validation with Ollama

The bonus test uses Ollama locally, so it does not require a paid API or an API key. Install Ollama from [ollama.com/download/windows](https://ollama.com/download/windows), then download the model:

```powershell
$env:OLLAMA_MODEL = 'llama3.2:3b'
ollama pull llama3.2:3b
$env:RUN_OLLAMA_TEST = '1'
npx playwright test tests/ai-classification.spec.ts
```

Ollama must be running at `http://localhost:11434`. The classifier requests JSON, checks the response is exactly `Good` or `Bad`, and compares it with the label already present in the diary. The test is skipped when `RUN_OLLAMA_TEST` is absent.

## Project Structure

```text
tests/
  pages/                    Page Object Model classes
  dream-portal.spec.ts      Core functional coverage
  ai-classification.spec.ts Optional AI validation
playwright.config.ts        Browser, URL, report, and artifact settings
.github/workflows/          GitHub Actions test workflow
```

## CI and Reports

Every push to `main` and every pull request runs the deterministic Playwright suite in GitHub Actions. The workflow uploads the HTML report as a `playwright-report` artifact, including screenshots for each test run and diagnostic video/trace data when applicable.
