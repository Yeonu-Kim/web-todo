import { implTodoUsecase } from './application/todo-usecase.js';
import { implTodoRepository } from './infrastructure/todo-repository.js';

import { TodoApp } from './interface/components/todo-app.js';

const todoRepository = implTodoRepository();
const todoUsecase = implTodoUsecase({ todoRepository });

const app = new TodoApp();
app.todoUsecase = todoUsecase;
document.body.appendChild(app);
