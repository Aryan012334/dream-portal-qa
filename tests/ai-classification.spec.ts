import { expect, test } from '@playwright/test';
import { DreamsDiaryPage, DreamEntry } from './pages/DreamsDiaryPage';

type DreamClassification = 'Good' | 'Bad';

async function classifyDreamName(name: string): Promise<DreamClassification> {
  const response = await fetch(process.env.OLLAMA_URL ?? 'http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL ?? 'llama3.2:3b',
      stream: false,
      format: 'json',
      prompt: `Classify this dream name as Good or Bad. Return only JSON in the form {"classification":"Good"} or {"classification":"Bad"}. Dream name: ${name}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama classification failed with HTTP ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json() as { response?: string };
  const content = payload.response;
  if (!content) {
    throw new Error(`Ollama response did not contain a classification for "${name}"`);
  }

  const classification = (JSON.parse(content) as { classification?: string }).classification;
  if (classification !== 'Good' && classification !== 'Bad') {
    throw new Error(`Unexpected classification for "${name}": ${classification}`);
  }
  return classification;
}

function expectedClassifications(entries: DreamEntry[]): Map<string, DreamClassification> {
  return new Map(entries.map((entry) => [entry.name, entry.type as DreamClassification]));
}

test.describe('AI dream classification', () => {
  test('classifies every unique dream name consistently with the diary', async ({ page }) => {
    test.skip(!process.env.RUN_OLLAMA_TEST, 'Set RUN_OLLAMA_TEST=1 to run the optional local AI validation.');

    const diary = new DreamsDiaryPage(page);
    await page.goto('dreams-diary.html');
    const entries = await diary.expectValidEntries();
    const expected = expectedClassifications(entries);

    for (const name of expected.keys()) {
      await expect.poll(() => classifyDreamName(name), { timeout: 30000 }).toBe(expected.get(name));
    }
  });
});