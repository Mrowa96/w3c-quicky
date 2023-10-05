export type FileValidationResult = {
  path: string;
  results: {
    // TODO Extend later on
    messages: {
      type: 'string';
      message: string;
    }[];
  };
};
