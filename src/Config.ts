import fs from 'fs/promises';
import { Command } from 'commander';
import glob from 'fast-glob';
import chalk from 'chalk';

export class Config {
  #command: Command;
  #paths: string[] = [];
  #excludedPaths: string[] = [];
  #isDebug = false;
  #displayAllMessages = false;
  #outputPath: string | undefined;
  #ignoredRules: string[] = [];

  constructor() {
    this.#command = new Command()
      .argument('<source>')
      .option('-d --debug', 'Display additional debug information about the process', false)
      .option('-a --all', 'Display all validation errors', false)
      .option('-o --output [path]', 'Save output to file under given path')
      .parse();
  }

  async init() {
    const configFromFile = await this.#loadConfigFile();

    this.#isDebug = this.#command.getOptionValue('debug');
    this.#displayAllMessages = this.#command.getOptionValue('all');
    this.#outputPath = this.#command.getOptionValue('output');
    this.#excludedPaths = configFromFile.excludedPaths;
    this.#ignoredRules = configFromFile.ignoredRules;
    this.#paths = await this.#preparePaths();

    return this;
  }

  async #loadConfigFile() {
    let excludedPaths: string[] = [];
    let ignoredRules: string[] = [];

    try {
      const configFileContent = await fs.readFile('./w3cquicky.json', 'utf8');

      const config = JSON.parse(configFileContent);

      if (typeof config === 'object' && config) {
        if (config.excludedPaths && Array.isArray(config.excludedPaths)) {
          excludedPaths = config.excludedPaths;
        }

        if (config.ignoredRules && Array.isArray(config.ignoredRules)) {
          ignoredRules = config.ignoredRules;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (
          !('code' in error) ||
          typeof error.code !== 'string' ||
          !['ENOENT', 'EACCES', 'EISDIR', 'EMFILE', 'EPERM'].includes(error.code)
        ) {
          console.error(chalk.red(error.message));
        }
      } else {
        console.error(chalk.red('Unknow error during reading/parsing config file', error));
      }
    }

    return {
      excludedPaths,
      ignoredRules,
    };
  }

  async #preparePaths() {
    const paths = await glob(this.#command.args);

    if (!this.#excludedPaths.length) {
      return paths;
    }

    const excludedPaths = await glob(this.#excludedPaths);

    if (!excludedPaths.length) {
      return paths;
    }

    return paths.filter(path => excludedPaths.find(excludedPath => !path.includes(excludedPath)));
  }

  get paths() {
    return this.#paths;
  }

  get isDebug() {
    return this.#isDebug;
  }

  get displayAllMessages() {
    return this.#displayAllMessages;
  }

  get outputPath() {
    return this.#outputPath;
  }

  get ignoredRules() {
    return this.#ignoredRules;
  }
}
