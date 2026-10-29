# Dream Portal QA — Automated Testing

Playwright + TypeScript automation suite for the Dream Portal assignment.

**Application under test:** https://arjitnigam.github.io/myDreams/

---

## Overview

This project automates functional testing of a dream journaling website covering three pages:
- `index.html` — Dream Portal Home
- `dreams-diary.html` — Dream Log Table
- `dreams-total.html` — Summary Statistics Page

It also includes cross-page data consistency validation and an optional local AI classification test using Ollama.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev) | Test framework |
| TypeScript | Language |
| Node.js 22 | Runtime |
| Allure Report | Rich HTML test reporting |
| Playwright HTML Reporter | Built-in test report |
| Ollama (local LLM) | AI-based dream classification (bonus) |
| GitHub Actions | CI/CD pipeline |

---

## Project Structure

```
dream-portal-qa/
├── .github/
│   └── workflows/
│       └── playwright.yml          GitHub Actions CI workflow
├── screenshots/                    Test run screenshots
├── tests/
│   ├── pages/                      Page Object Model classes
│   │   ├── DreamPortalHomePage.ts
│   │   ├── DreamsDiaryPage.ts
│   │   └── DreamsTotalPage.ts
│   ├── home.spec.ts                Home page tests (TC-01 to TC-05)
│   ├── dreams-diary.spec.ts        Diary page tests (DD-01 to DD-06)
│   ├── dreams-total.spec.ts        Summary page tests (DS-01 to DS-05)
│   ├── cross-page.spec.ts          Cross-page data validation (CP-01 to CP-05)
│   └── ai-classification.spec.ts   Optional Ollama AI validation
├── .env.example                    Environment variable template
├── playwright.config.ts            Playwright + Allure configuration
├── package.json
└── tsconfig.json
```

---

## Test Coverage

### Home Page (5 tests)
| ID | Test |
|---|---|
| TC-01 | Loading animation appears on page load |
| TC-02 | Loading animation disappears after ~3 seconds |
| TC-03 | Main portal content becomes visible after loading |
| TC-04 | My Dreams button is visible and enabled |
| TC-05 | Clicking My Dreams opens dreams-diary.html and dreams-total.html in new tabs |

### Dreams Diary (6 tests)
| ID | Test |
|---|---|
| DD-01 | Page loads and table is visible |
| DD-02 | Table contains exactly 10 dream entries |
| DD-03 | All dream types are "Good" or "Bad" |
| DD-04 | Every row has Dream Name, Days Ago and Dream Type filled |
| DD-05 | Days Ago values are valid non-negative numbers |
| DD-06 | Identifies the two recurring dreams from diary data |

### Dreams Summary (5 tests)
| ID | Test |
|---|---|
| DS-01 | Page has the correct heading and table |
| DS-02 | Good Dreams count is 6 |
| DS-03 | Bad Dreams count is 4 |
| DS-04 | Total Dreams count is 10 |
| DS-05 | Recurring Dreams count is 2 |

### Cross-Page Validation (5 tests)
| ID | Test |
|---|---|
| CP-01 | Total Dreams count on summary page matches diary entry count |
| CP-02 | Good Dreams count on summary page matches diary data |
| CP-03 | Bad Dreams count on summary page matches diary data |
| CP-04 | Recurring Dreams count on summary page matches diary data |
| CP-05 | Recurring dreams found in Diary are "Flying over mountains" and "Lost in maze" |

**Core Total: 21 tests**

### AI Bonus (1 test)
- Classifies every unique dream name via local Ollama LLM and compares against diary data

---

## Local Setup

**Requirements:** Node.js 22 or newer.

```powershell
npm ci
npx playwright install chromium
```

### Run Tests

```powershell
# Run core test suite (all functional tests)
npm run test:core

# Run all tests
npm test

# Run in headed (visible browser) mode
npm run test:headed
```

### View Reports

```powershell
# Playwright HTML report
npm run report

# Generate and open Allure report
npm run allure:generate
npm run allure:open

# Or serve Allure directly from results
npm run allure:serve
```

---

## Optional AI Validation with Ollama

The bonus test uses a local Ollama LLM — no paid API key required.

1. Install Ollama from [ollama.com/download/windows](https://ollama.com/download/windows)
2. Pull the model and run the test:

```powershell
ollama pull llama3.2:3b

$env:RUN_OLLAMA_TEST = '1'
npm run test:ai
```

Ollama must be running at `http://localhost:11434`. The classifier sends each unique dream name in a structured JSON prompt, validates the response is exactly `Good` or `Bad`, and asserts it matches the diary entry. The test is skipped automatically when `RUN_OLLAMA_TEST` is not set.

---

## CI/CD

Every push to `main` or `enhanced-structure` and every pull request runs the full core test suite via GitHub Actions. The workflow:

1. Installs dependencies and Playwright Chromium
2. Runs the core test suite (`npm run test:core`)
3. Generates an Allure report
4. Uploads both the **Playwright HTML report** and **Allure report** as build artifacts (retained 14 days)

> The AI test is excluded from CI since it requires a local Ollama instance.

---

## Page Object Model

The POM layer decouples selectors and page interactions from test assertions:

| Class | Responsibility |
|---|---|
| `DreamPortalHomePage` | Loading state, loaded state, opening dream pages |
| `DreamsDiaryPage` | Table rows, entry validation, recurring dream detection |
| `DreamsTotalPage` | Summary stats, row-level assertions |
