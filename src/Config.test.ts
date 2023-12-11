import { strictEqual } from 'node:assert';
import { test, mock } from 'node:test';
import esmock from 'esmock';
import { Config } from './Config.js';

const originalArgv = process.argv;
const consoleErrorMock = mock.method(console, 'error', () => {});

async function mockConfigDependencies(readFileMock: () => Promise<string>, globMock?: () => Promise<string[]>) {
  const { Config } = (await esmock('./Config.js', {
    'fs/promises': {
      readFile: readFileMock,
    },
    'fast-glob': globMock ?? (async () => []),
  })) as typeof import('./Config.js');

  return Config;
}

test('init', async t => {
  t.beforeEach(() => {
    process.argv = ['node', '/dist/bin/index.js', './**/*.html'];

    consoleErrorMock.mock.resetCalls();
  });

  await t.test('sets default values on Config instance', async () => {
    const config = await new Config().init();

    strictEqual(config.isDebug, false, 'isDebug should be false');
    strictEqual(config.displayAllMessages, false, 'displayAllMessages should be false');
    strictEqual(config.outputPath, undefined, 'outputPath should be undefined');
  });

  await t.test('parse basic options and init config instance with them', async () => {
    process.argv = ['node', '/dist/bin/index.js', '-d', '--all', '-o', './output.json', './website.html'];

    const config = await new Config().init();

    strictEqual(config.isDebug, true, 'isDebug should be true');
    strictEqual(config.displayAllMessages, true, 'displayAllMessages should be true');
    strictEqual(config.outputPath, './output.json', 'outputPath should be equal to ./output.json');
  });

  await t.test('handles readFile error with code', async () => {
    const Config = await mockConfigDependencies(async () => {
      const error = new Error('Some system error');

      // @ts-expect-error Property 'code' does not exist on type 'Error'
      error.code = 'ENOENT';

      throw error;
    });

    const results = await new Config().init();

    strictEqual(consoleErrorMock.mock.callCount(), 0);
    strictEqual(results.ignoredRules.length, 0);
  });

  await t.test('handles readFile error with dummy class', async () => {
    const Config = await mockConfigDependencies(async () => {
      throw new (class Test {})();
    });

    const results = await new Config().init();

    strictEqual(consoleErrorMock.mock.callCount(), 1);
    // strictEqual(consoleErrorMock.mock.calls[0].arguments[0], 'Unknow error during reading/parsing config file');
    strictEqual(results.ignoredRules.length, 0);
  });

  await t.test('handles redFile error when config file is not proper json', async () => {
    const Config = await mockConfigDependencies(async () => 'some invalid value');

    const results = await new Config().init();

    strictEqual(consoleErrorMock.mock.callCount(), 1);
    // strictEqual(consoleErrorMock.mock.calls[0].arguments[0], 'Unexpected token s in JSON at position 0');
    strictEqual(results.ignoredRules.length, 0);
  });

  await t.test('fill ignoredRules when config file is proper json', async () => {
    const Config = await mockConfigDependencies(async () => JSON.stringify({ ignoredRules: ['rule 1', 'rule 2'] }));

    const results = await new Config().init();

    strictEqual(consoleErrorMock.mock.callCount(), 0);
    strictEqual(results.ignoredRules[0], 'rule 1');
    strictEqual(results.ignoredRules[1], 'rule 2');
  });

  // await t.test('has paths with excluded ones from config', async () => {
  //   const Config = await mockConfigDependencies(
  //     async () => JSON.stringify({ excludedPaths: ['./**/*-test.html'] }),
  //     async () => [
  //       './pages/index.html',
  //       './pages/page-test.html',
  //       './pages/account.html',
  //       './pages/prohibited-test.html',
  //     ],
  //   );

  //   const results = await new Config().init();
  //   console.log(results.paths, 2);
  //   strictEqual(results.paths.length, 2);
  // });

  t.after(() => {
    process.argv = originalArgv;
  });
});
