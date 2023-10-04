import { request } from 'undici';
import { readFile, writeFile } from 'fs/promises';

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36';

try {
  const fileContent = await readFile('./invalid.html', { encoding: 'utf8' });

  const { statusCode, body } = await request('https://validator.nu/?out=json', {
    method: 'POST',
    body: fileContent,
    headers: {
      'User-Agent': DEFAULT_USER_AGENT,
      'Content-Type': 'text/html; charset=utf-8',
    },
  });

  if (statusCode !== 200) {
    throw new Error(`Status code ${statusCode}`);
  }

  const results = await body.json();
  // Only for tests
  const stringifiedJsonResults = JSON.stringify(results, undefined, 2);

  if (typeof stringifiedJsonResults !== 'string') {
    throw new Error(`Parsed body is not a string`);
  }

  await writeFile('./output.json', stringifiedJsonResults, { encoding: 'utf8' });
} catch (error) {
  console.error(error);
}
