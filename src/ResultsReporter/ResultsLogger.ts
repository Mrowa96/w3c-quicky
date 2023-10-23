import chalk, { type ChalkInstance } from 'chalk';
import type { Message } from '../FileValidator/types.js';
import { FileValidationError } from '../FileValidator/FileValidationError.js';

export class ResultsLogger {
  #coloredLog: Record<string, ChalkInstance> = {
    info: chalk.cyan,
    warning: chalk.yellow,
    error: chalk.red,
    fatal: chalk.redBright,
  };

  displayPathLine(path: string, hasErrors: boolean, addNewLine: boolean) {
    console.log(
      `${addNewLine ? '\n' : ''}${chalk.blue(path)} - ${
        hasErrors ? chalk.bold.red('FAIL') : chalk.bold.green('SUCCESS')
      }`,
    );
  }

  displayPathErrorLine(message: Message) {
    const key = message.subType ?? message.type;

    console.log(`\t${this.#getColoredLog(key)(`${key}`)}: ${message.message}`);
    console.log(chalk.dim(`\t\t${message.extract.replaceAll('\n', '')}`));
  }

  displayShowMoreLine(moreErrorsQuantity: number) {
    console.log(
      `\t${chalk.magenta(`+${moreErrorsQuantity} more`)} ${chalk.dim(`(add -a arg to display all messages)`)}`,
    );
  }

  displayValidationErrorLine(validationError: FileValidationError, addNewLine: boolean) {
    console.log(`${addNewLine ? '\n' : ''}${validationError.path} - ${chalk.red('ERROR')}`);
    console.log(`\t${validationError.message}${validationError.cause && `: ${validationError.cause.message}`}`);
  }

  displayUnknowErrorLine(reason: unknown, addNewLine: boolean) {
    console.log(`${addNewLine ? '\n' : ''}What have happened here? 🧐`);

    if (reason) {
      console.log(reason);
    }
  }

  #getColoredLog(key: string, fallback = chalk.white) {
    if (key in this.#coloredLog) {
      return this.#coloredLog[key];
    }

    return fallback;
  }
}
