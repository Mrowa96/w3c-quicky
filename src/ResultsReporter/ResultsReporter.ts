import { FileValidationError } from '../FileValidator/FileValidationError.js';
import type { FileValidationResult } from '../FileValidator/types.js';
import { ResultsLogger } from './ResultsLogger.js';

export class ResultsReporter {
  #logger;
  #results;
  #displayAllMessage;

  constructor(results: PromiseSettledResult<FileValidationResult>[], displayAllMessage = false) {
    this.#logger = new ResultsLogger();
    this.#results = results;
    this.#displayAllMessage = displayAllMessage;
  }

  report() {
    let isSuccessfull = true;

    this.#results.forEach((result, index) => {
      const addNewLine = index !== 0;

      if (result.status === 'fulfilled') {
        const { messages } = result.value.results;
        const hasErrors = messages.length > 0;
        const maxEntriesVisible = this.#displayAllMessage ? messages.length : 2;

        this.#logger.displayPathLine(result.value.path, hasErrors, addNewLine);

        if (!hasErrors) {
          return;
        }

        for (let i = 0; i < maxEntriesVisible; i++) {
          const message = messages[i];

          if (!message) {
            break;
          }

          this.#logger.displayPathErrorLine(message);
        }

        if (messages.length > maxEntriesVisible) {
          this.#logger.displayShowMoreLine(messages.length - maxEntriesVisible);
        }
      } else {
        isSuccessfull = false;

        if (result.reason instanceof FileValidationError) {
          this.#logger.displayValidationErrorLine(result.reason.path, addNewLine);
        } else {
          this.#logger.displayUnknowErrorLine(result.reason, addNewLine);
        }
      }
    });

    return {
      isSuccessfull,
    };
  }
}
