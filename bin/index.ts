#! /usr/bin/env node
import { program } from 'commander';
import glob from 'fast-glob';
import { MemoryUsageReporter } from '../src/MemoryUsageReporter.js';
import { TotalTimeReporter } from '../src/TotalTimeReporter.js';
import { ResultsReporter } from '../src/ResultsReporter.js';
import { FileValidator } from '../src/FileValidator/FileValidator.js';
import { EXIT_CODE_SUCCESS, EXIT_CODE_ERROR, EXIT_CODE_NO_SOURCES } from './consts.js';

try {
  program
    .argument('<source>')
    .option('-d --debug', 'Display additional debug information about the process', false)
    .parse();

  const memoryUsageReporter = new MemoryUsageReporter();
  const totalTimeReporter = new TotalTimeReporter();
  const isDebug = program.getOptionValue('debug');

  isDebug && memoryUsageReporter.mark('Start');
  totalTimeReporter.start();

  const paths = await glob(program.args);

  if (!paths.length) {
    process.exit(EXIT_CODE_NO_SOURCES);
  }

  const results = await Promise.allSettled(
    paths.map(path => {
      return new FileValidator(path).validate();
    }),
  );

  const resultsReporter = new ResultsReporter(results);

  isDebug && memoryUsageReporter.mark('Files checked');
  totalTimeReporter.end();

  const { isSuccessfull } = resultsReporter.report();

  isDebug && memoryUsageReporter.report();
  totalTimeReporter.report();

  process.exit(isSuccessfull ? EXIT_CODE_SUCCESS : EXIT_CODE_ERROR);
} catch (error) {
  console.error(error);
  process.exit(EXIT_CODE_ERROR);
}
