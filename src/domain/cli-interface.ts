import type { RepositoryResponseType } from './response-type.js';

type CliRepositorySuccessResponse =
  | { state: 'HELP' | 'READ_TODOS' }
  | { state: 'ADD_TODO'; content: string }
  | { state: 'UPDATE_DONE' | 'DELETE'; id: number }
  | { state: 'UPDATE'; id: number; newContent: string };

export type CliRepository = {
  parseCommand: () => RepositoryResponseType<CliRepositorySuccessResponse>;
};

export type CliPresenter = {
  run: () => void;
};
