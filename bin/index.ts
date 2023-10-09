#! /usr/bin/env node
import chalk from 'chalk';
import { MemoryUsageReporter } from '../src/MemoryUsageReporter.js';
import { TotalTimeReporter } from '../src/TotalTimeReporter.js';
import { ResultsReporter } from '../src/ResultsReporter/ResultsReporter.js';
import { FileValidator } from '../src/FileValidator/FileValidator.js';
import { ResultsWriter } from '../src/ResultsWriter.js';
import { Config } from '../src/Config.js';
import { EXIT_CODE_SUCCESS, EXIT_CODE_ERROR, EXIT_CODE_NO_SOURCES } from './consts.js';

try {
  const totalTimeReporter = new TotalTimeReporter();

  totalTimeReporter.start();

  const config = await new Config().init();

  const memoryUsageReporter = new MemoryUsageReporter(config);

  memoryUsageReporter.mark('Config inited');

  if (!config.paths.length) {
    console.log(chalk.red('Cannot find any files to validate.'));
    process.exit(EXIT_CODE_NO_SOURCES);
  }

  const results = await Promise.allSettled(
    config.paths.map(path => {
      return new FileValidator(path, config).validate();
    }),
  );

  memoryUsageReporter.mark('Files checked');

  const resultsReporter = new ResultsReporter(results, config);
  const { isSuccessfull } = resultsReporter.report();

  memoryUsageReporter.mark('Results reported');

  if (config.outputPath) {
    const resultsWriter = new ResultsWriter(results, config.outputPath);

    await resultsWriter.write();

    memoryUsageReporter.mark('Results saved to the file');
  }

  memoryUsageReporter.report();
  totalTimeReporter.end();
  totalTimeReporter.report();

  process.exit(isSuccessfull ? EXIT_CODE_SUCCESS : EXIT_CODE_ERROR);
} catch (error) {
  console.error(error);
  process.exit(EXIT_CODE_ERROR);
}
