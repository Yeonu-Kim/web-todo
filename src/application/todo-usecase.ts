import type { TodoRepository, TodoUsecase } from '../domain/todo-interface';

export const implTodoUsecase = ({
  todoRepository,
}: {
  todoRepository: TodoRepository;
}): TodoUsecase => ({
  addTodo: ({ content }) => {
    const result = todoRepository.readTodos();
    if (result.state === 'error') {
      return result;
    }
    const { data: todos } = result;
    const newId =
      todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
    const newTodo = { id: newId, content, done: false };
    todos.push(newTodo);
    return todoRepository.writeTodos({ todos });
  },
  listTodos: () => {
    return todoRepository.readTodos();
  },
  doneTodo: ({ id }) => {
    const result = todoRepository.readTodos();
    if (result.state === 'error') {
      return result;
    }
    const { data: todos } = result;
    const todo = todos.find((t) => t.id === id);
    if (todo === undefined) {
      return { state: 'error', detailedError: 'NOT_FOUND_ID_IN_DONE' };
    }
    const updatedTodos = todos.map((t) =>
      t.id === id ? { ...t, done: true } : t
    );
    return todoRepository.writeTodos({ todos: updatedTodos });
  },
  deleteTodo: ({ id }) => {
    const result = todoRepository.readTodos();
    if (result.state === 'error') {
      return result;
    }
    const { data: todos } = result;
    const todo = todos.find((t) => t.id === id);
    if (todo === undefined) {
      return { state: 'error', detailedError: 'NOT_FOUND_ID_IN_DELETE' };
    }
    const updatedTodos = todos.filter((t) => t.id !== id);
    const response = todoRepository.writeTodos({ todos: updatedTodos });
    if (response.state === 'error') {
      return response;
    }
    return {
      state: 'success',
      data: { id, removedContent: todo.content },
    };
  },
  updateTodo: ({ id, newContent }) => {
    const result = todoRepository.readTodos();
    if (result.state === 'error') {
      return result;
    }
    const { data: todos } = result;
    const todo = todos.find((t) => t.id === id);
    if (todo === undefined) {
      return { state: 'error', detailedError: 'NOT_FOUND_ID_IN_UPDATE' };
    }
    const oldContent = todo.content;
    const updatedTodos = todos.map((t) =>
      t.id === id ? { ...t, content: newContent } : t
    );
    const response = todoRepository.writeTodos({ todos: updatedTodos });
    if (response.state === 'error') {
      return response;
    }
    return {
      state: 'success',
      data: { id, oldContent, newContent },
    };
  },
});
