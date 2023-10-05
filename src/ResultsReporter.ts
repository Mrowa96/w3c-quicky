import { FileValidationError } from './FileValidator/FileValidationError.js';
import type { FileValidationResult } from './FileValidator/types.js';

export class ResultsReporter {
  #results;

  constructor(results: PromiseSettledResult<FileValidationResult>[]) {
    this.#results = results;
  }

  report() {
    console.table(
      this.#results.reduce((accumulator, result) => {
        if (result.status === 'fulfilled') {
          const hasErrors = result.value.results.messages.length > 0;

          return {
            ...accumulator,
            [result.value.path]: hasErrors ? '💩' : '✅',
          };
        }

        if (result.reason instanceof FileValidationError) {
          return {
            ...accumulator,
            [result.reason.path]: result.reason.message,
          };
        }

        return {
          ...accumulator,
          [result.reason.path]: 'What have happened here? 🧐',
        };
      }, {}),
    );
  }
}
