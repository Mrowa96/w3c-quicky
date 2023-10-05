import { ResultError, type CheckFileResult } from './checkFile.js';

export class ResultsReporter {
  #results;

  constructor(results: PromiseSettledResult<CheckFileResult>[]) {
    this.#results = results;
  }

  report() {
    console.table(
      this.#results.reduce((accumulator, result) => {
        if (result.status === 'fulfilled') {
          return {
            ...accumulator,
            [result.value.path]: result.value.statusCode,
          };
        }

        if (result.reason instanceof ResultError) {
          return {
            ...accumulator,
            [result.reason.path]: result.reason.message,
          };
        }

        return {
          ...accumulator,
          [`unknown-${crypto.randomUUID()}`]: 'What have happened here? 🧐',
        };
      }, {}),
    );
  }
}