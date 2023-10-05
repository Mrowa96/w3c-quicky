import glob from 'fast-glob';
import { MemoryUsageReporter } from './src/MemoryUsageReporter.js';
import { TotalTimeReporter } from './src/TotalTimeReporter.js';
import { ResultsReporter } from './src/ResultsReporter.js';
import { FileValidator } from './src/FileValidator/FileValidator.js';

try {
  const memoryUsageReporter = new MemoryUsageReporter();
  const totalTimeReporter = new TotalTimeReporter();

  memoryUsageReporter.mark('Start');
  totalTimeReporter.start();

  const paths = await glob('./test-build/**/*.html');

  memoryUsageReporter.mark('Paths read');

  const results = await Promise.allSettled(
    paths.map(path => {
      return new FileValidator(path).validate();
    }),
  );
  const resultsReporter = new ResultsReporter(results);

  memoryUsageReporter.mark('Files checked');
  totalTimeReporter.end();

  resultsReporter.report();
  memoryUsageReporter.report();
  totalTimeReporter.report();

  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
