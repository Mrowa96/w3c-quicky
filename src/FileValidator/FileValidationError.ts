export class FileValidationError extends Error {
  #path;

  constructor(path: string, message: string, options?: ErrorOptions) {
    super(message, options);

    this.#path = path;
  }

  get path() {
    return this.#path;
  }
}
