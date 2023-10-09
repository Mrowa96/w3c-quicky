import type { Config } from './Config.js';

type Mark = {
  heapUsed: number;
  label: string;
};

export class MemoryUsageReporter {
  #config;
  #marks: Mark[] = [];

  constructor(config: Config) {
    this.#config = config;
  }

  mark(label: string) {
    if (!this.#config.isDebug) {
      return;
    }

    this.#marks.push({
      heapUsed: process.memoryUsage().heapUsed,
      label,
    });
  }

  report() {
    if (!this.#config.isDebug) {
      return;
    }

    console.info('\nMemory usage:');
    console.table(
      this.#marks.reduce((accumulator, { heapUsed, label }) => {
        return {
          ...accumulator,
          [label]: `${Math.round((heapUsed / 1024 / 1024) * 100) / 100}MB`,
        };
      }, {}),
    );
  }
}
