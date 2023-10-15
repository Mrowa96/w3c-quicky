import { strictEqual } from 'node:assert';
import { test, after, mock } from 'node:test';
import esmock from 'esmock';
import { Config } from './Config.js';

const originalArgv = process.argv;

test('sets default values on Config instance', async () => {
  process.argv = ['node', '/dist/bin/index.js', './website.html'];

  const config = await new Config().init();

  strictEqual(config.isDebug, false, 'isDebug should be false');
  strictEqual(config.displayAllMessages, false, 'displayAllMessages should be false');
  strictEqual(config.outputPath, undefined, 'outputPath should be undefined');
});

test('should parse basic options and init config instance with them', async () => {
  process.argv = ['node', '/dist/bin/index.js', '-d', '--all', '-o', './output.json', './website.html'];

  const config = await new Config().init();

  strictEqual(config.isDebug, true, 'isDebug should be true');
  strictEqual(config.displayAllMessages, true, 'displayAllMessages should be true');
  strictEqual(config.outputPath, './output.json', 'outputPath should be equal to ./output.json');
});

test('xxx', async () => {
  process.argv = ['node', '/dist/bin/index.js', './website.html'];

  const { Config } = (await esmock('./Config.js', {
    'fs/promises': {
      readFile: async () => {
        throw new Error('Error without code');
      },
    },
  })) as typeof import('./Config.js');

  const consoleErrorMock = mock.method(console, 'error', () => {});

  await new Config().init();
  console.log(consoleErrorMock.mock.callCount());
  strictEqual(consoleErrorMock.mock.callCount(), 1, 'console.error should be called once');
  // strictEqual(
  //   consoleErrorMock.mock.calls[0].arguments,
  //   'Unknow error during reading/parsing config file',
  //   'console.error should be with specific error',
  // );
});

after(() => {
  process.argv = originalArgv;
});
