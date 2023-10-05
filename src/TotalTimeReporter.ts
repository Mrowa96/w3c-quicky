import { PerformanceObserver, performance } from 'node:perf_hooks';

export class TotalTimeReporter {
  #observer;

  constructor() {
    this.#observer = new PerformanceObserver(() => {
      performance.clearMarks();
    });

    this.#observer.observe({ type: 'measure' });
  }

  start() {
    performance.mark('Start');
  }

  end() {
    performance.mark('End');
  }

  report() {
    const measure = performance.measure('Total time', 'Start', 'End');

    this.#observer.disconnect();

    console.info(
      `Total time: ${measure.duration.toLocaleString('en', {
        compactDisplay: 'short',
      })}ms`,
    );
  }
}
