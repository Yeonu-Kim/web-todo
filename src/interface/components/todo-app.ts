import type { DateUsecase } from '../../domain/date-interface';
import type { TodoUsecase } from '../../domain/todo-interface';
import { inject } from '../decorators/attr.js';
import { customElement } from '../decorators/custom-element';
import { TodoHeader } from './todo-header';
import { TodoInput } from './todo-input';

@customElement('todo-app')
export class TodoApp extends HTMLElement {
  @inject<TodoUsecase>('todoUsecase')
  accessor todoUsecase!: TodoUsecase;
  @inject<DateUsecase>('dateUsecase')
  accessor dateUsecase!: DateUsecase;

  connectedCallback() {
    this.innerHTML = this.template();
    this.injectDependencies();
  }

  private injectDependencies() {
    const todoInput = this.querySelector<TodoInput>('todo-input');
    const todoHeader = this.querySelector<TodoHeader>('todo-header');

    if (todoInput == null) throw new Error('todo-input을 찾을 수 없어요.');
    if (todoHeader == null) throw new Error('todo-header를 찾을 수 없어요.');

    todoInput.todoUsecase = this.todoUsecase;
    todoHeader.dateUsecase = this.dateUsecase;
    todoHeader.render();
  }

  private template() {
    return /* html */ `
      <div class="background">
        <div class="card">
          <todo-header></todo-header>
          <todo-input></todo-input>
          <todo-list></todo-list>
        </div>
      </div>
    `;
  }
}
