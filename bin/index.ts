#! /usr/bin/env node
import { program } from 'commander';
import glob from 'fast-glob';
import { MemoryUsageReporter } from '../src/MemoryUsageReporter.js';
import { TotalTimeReporter } from '../src/TotalTimeReporter.js';
import { ResultsReporter } from '../src/ResultsReporter/ResultsReporter.js';
import { FileValidator } from '../src/FileValidator/FileValidator.js';
import { ResultsWriter } from '../src/ResultsWriter.js';
import { EXIT_CODE_SUCCESS, EXIT_CODE_ERROR, EXIT_CODE_NO_SOURCES } from './consts.js';

try {
  program
    .argument('<source>')
    .option('-d --debug', 'Display additional debug information about the process', false)
    .option('-a --all', 'Display all validation errors', false)
    .option('-o --output [path]', 'Save output to file under given path')
    .parse();

  const memoryUsageReporter = new MemoryUsageReporter();
  const totalTimeReporter = new TotalTimeReporter();
  const isDebug: boolean = program.getOptionValue('debug');
  const displayAllMessage: boolean = program.getOptionValue('all');
  const outputPath: string | undefined = program.getOptionValue('output');

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

  isDebug && memoryUsageReporter.mark('Files checked');

  const resultsReporter = new ResultsReporter(results, displayAllMessage);
  const { isSuccessfull } = resultsReporter.report();

  if (outputPath) {
    const resultsWriter = new ResultsWriter(results, outputPath);

    await resultsWriter.write();
  }

  isDebug && memoryUsageReporter.report();

  totalTimeReporter.end();
  totalTimeReporter.report();

  process.exit(isSuccessfull ? EXIT_CODE_SUCCESS : EXIT_CODE_ERROR);
} catch (error) {
  console.error(error);
  process.exit(EXIT_CODE_ERROR);
}
