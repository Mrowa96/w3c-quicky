export class FileValidationError extends Error {
  #cause: Error | undefined;
  #path;

  constructor(path: string, message: string, options?: ErrorOptions) {
    super(message, options);

    this.#path = path;
    this.#cause = options?.cause instanceof Error ? options.cause : undefined;
  }

  get path() {
    return this.#path;
  }

  get cause() {
    return this.#cause;
  }
}
