export type TodoResponse = {
  something: string;
};

export type TodoIdParams = {
  id: number;
};

export type CreateOrPatchTodo = {
  content: string;
  done: boolean;
};
