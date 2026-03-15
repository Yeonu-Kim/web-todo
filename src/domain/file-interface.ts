import type { RepositoryResponseType } from './response-type.js';

export type Todo = {
  id: number;
  content: string;
  done: boolean;
};

export type FileRepository = {
  readTodos: () => RepositoryResponseType<Todo[]>;
  writeTodos: ({ todos }: { todos: Todo[] }) => RepositoryResponseType<void>;
};
