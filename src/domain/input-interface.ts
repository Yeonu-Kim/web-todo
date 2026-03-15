import type { RepositoryResponseType } from './response-type.js';

type InputRepositorySuccessResponse =
  | { state: 'HELP' | 'READ_TODOS' }
  | { state: 'ADD_TODO'; content: string }
  | { state: 'UPDATE_DONE' | 'DELETE'; id: number }
  | { state: 'UPDATE'; id: number; newContent: string };

export type InputRepository = {
  parseCommand: () => RepositoryResponseType<InputRepositorySuccessResponse>;
};
