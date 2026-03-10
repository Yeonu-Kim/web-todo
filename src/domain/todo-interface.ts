import type {
  RepositoryResponseType,
  UseCaseResponseType,
} from './response-type.js';

export type Todo = {
  id: number;
  content: string;
  done: boolean;
};

export type TodoRepository = {
  readTodos: () => RepositoryResponseType<Todo[]>;
  writeTodos: ({ todos }: { todos: Todo[] }) => RepositoryResponseType<void>;
};

export type TodoUsecase = {
  addTodo: ({ content }: { content: string }) => UseCaseResponseType<void>;
  listTodos: () => UseCaseResponseType<Todo[]>;
  doneTodo: ({ id }: { id: number }) => UseCaseResponseType<void>;
  deleteTodo: ({
    id,
  }: {
    id: number;
  }) => UseCaseResponseType<{ id: number; removedContent: string }>;
  updateTodo: ({
    id,
    newContent,
  }: {
    id: number;
    newContent: string;
  }) => UseCaseResponseType<{
    id: number;
    newContent: string;
    oldContent: string;
  }>;
};
