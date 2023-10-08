type Mark = {
  heapUsed: number;
  label: string;
};

export class MemoryUsageReporter {
  #marks: Mark[] = [];

  mark(label: string) {
    this.#marks.push({
      heapUsed: process.memoryUsage().heapUsed,
      label,
    });
  }

  report() {
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
