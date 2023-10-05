import { ResultError, type CheckFileResult } from './checkFile.js';

export class ResultsReporter {
  #results;

  constructor(results: PromiseSettledResult<CheckFileResult>[]) {
    this.#results = results;
  }

  report() {
    this.#results.forEach(result => {
      if (result.status === 'rejected' && result.reason instanceof ResultError) {
        console.log(result.reason.path, result.reason.message);
      }
    });

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
