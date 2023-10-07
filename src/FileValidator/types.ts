export type MessageType = 'info' | 'warning' | 'error';

export type Message = {
  type: MessageType;
  subType?: 'warning' | 'fatal';
  message: string;
  extract: string;
};

export type FileValidationResult = {
  path: string;
  results: {
    messages: Message[];
  };
};
