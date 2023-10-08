import { writeFile } from 'fs/promises';
import type { FileValidationResult } from './FileValidator/types.js';
import { FileValidationError } from './FileValidator/FileValidationError.js';

export class ResultsWriter {
  #results;
  #path;

  constructor(results: PromiseSettledResult<FileValidationResult>[], path: string) {
    this.#results = results;
    this.#path = path;
  }

  async write() {
    const preparedResults = this.#results.reduce((accumulator, result) => {
      if (result.status === 'fulfilled') {
        return {
          ...accumulator,
          [result.value.path]: result.value.results,
        };
      }

      if (result.reason instanceof FileValidationError) {
        return {
          ...accumulator,
          [result.reason.path]: result.reason.message,
        };
      }

      return accumulator;
    }, {});

    await writeFile(this.#path, JSON.stringify(preparedResults, undefined, 2), {
      encoding: 'utf8',
    });
  }
}
