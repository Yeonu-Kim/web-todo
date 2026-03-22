import type { CallWithoutToken, SuccessResponse } from './api-domain';
import type {
  CreateOrPatchTodo,
  TodoIdParams,
  TodoResponse,
} from './api-scheme';

export const implMockServerApis = ({
  callWithoutToken,
}: {
  callWithoutToken: CallWithoutToken;
}) => ({
  'GET /todos': () => {
    callWithoutToken<SuccessResponse<TodoResponse>>({
      method: 'GET',
      path: 'todos',
    });
  },
  'GET /todos/:id': ({ params }: { params: TodoIdParams }) => {
    callWithoutToken<SuccessResponse<TodoResponse>>({
      method: 'GET',
      path: `todos/${params.id}`,
    });
  },
  'POST /todos': ({ body }: { body: CreateOrPatchTodo }) => {
    callWithoutToken<SuccessResponse<TodoResponse>>({
      method: 'POST',
      path: 'todos',
      body,
    });
  },
  'PUT /todos/:id': ({
    params,
    body,
  }: {
    params: TodoIdParams;
    body: CreateOrPatchTodo;
  }) => {
    callWithoutToken<SuccessResponse<TodoResponse>>({
      method: 'POST',
      path: `todos/${params.id}`,
      body,
    });
  },
  'DELETE /todos/:id': ({ params }: { params: TodoIdParams }) => {
    callWithoutToken<SuccessResponse<TodoResponse>>({
      method: 'DELETE',
      path: `todos/${params.id}`,
    });
  },
});
