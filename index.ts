import { implTodoUsecase } from './src/application/todo-usecase.js';
import { implInputRepository } from './src/infrastructure/input-repository.js';
import { implTodoRepository } from './src/infrastructure/todo-repository.js';
import { implOutputPresenter } from './src/interface/output-presenter.js';

const inputRepository = implInputRepository();
const todoRepository = implTodoRepository();
const todoUsecase = implTodoUsecase({ todoRepository });
const cliPresenter = implOutputPresenter({ inputRepository, todoUsecase });

cliPresenter.run();
