import { readFile } from 'fs/promises';
import { request } from 'undici';

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36';

export type CheckFileResult = { path: string } & (
  | {
      statusCode: 200;
      parsedBody: unknown;
    }
  | {
      statusCode: number;
      parsedBody: string;
    }
);

export class ResultError extends Error {
  #path;

  constructor(path: string, message: string, options?: ErrorOptions) {
    super(message, options);

    this.#path = path;
  }

  get path() {
    return this.#path;
  }
}

export async function checkFile(path: string): Promise<CheckFileResult> {
  try {
    const fileContent = await readFile(path, { encoding: 'utf8' });
    const { statusCode, body } = await request('https://validator.nu/?out=json', {
      method: 'POST',
      body: fileContent,
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
        'Content-Type': 'text/html; charset=utf-8',
      },
    });

    if (statusCode === 200) {
      return {
        path,
        statusCode,
        parsedBody: await body.json(),
      };
    }

    return {
      path,
      statusCode,
      parsedBody: await body.text(),
    };
  } catch (error) {
    throw new ResultError(path, 'Check failed.', {
      cause: error,
    });
  }
}
