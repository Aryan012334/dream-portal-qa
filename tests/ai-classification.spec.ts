import { expect, test } from '@playwright/test';
import { DreamsDiaryPage, DreamEntry } from './pages/DreamsDiaryPage';

type DreamClassification = 'Good' | 'Bad';

async function classifyDreamName(name: string): Promise<DreamClassification> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'Classify dream names as Good or Bad. Return only JSON in the form {"classification":"Good"} or {"classification":"Bad"}.',
        },
        { role: 'user', content: name },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI classification failed with HTTP ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json() as { choices?: [{ message?: { content?: string } }] };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error(`OpenAI response did not contain a classification for "${name}"`);
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
    test.skip(!process.env.OPENAI_API_KEY, 'Set OPENAI_API_KEY to run the optional AI validation.');

    const diary = new DreamsDiaryPage(page);
    await page.goto('dreams-diary.html');
    const entries = await diary.expectValidEntries();
    const expected = expectedClassifications(entries);

    for (const name of expected.keys()) {
      await expect.poll(() => classifyDreamName(name), { timeout: 30000 }).toBe(expected.get(name));
    }
  });
});