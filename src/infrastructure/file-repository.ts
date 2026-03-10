import fs from 'fs';
import path from 'path';
import type { FileRepository, Todo } from '../domain/file-interface';
import { TODO_FILE_PATH } from '../domain/file-root';

const TODO_FILE = path.resolve(process.cwd(), TODO_FILE_PATH);

const todoTypeGuard = (value: unknown): value is Todo => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'content' in value &&
    'done' in value &&
    typeof (value as Todo).id === 'number' &&
    typeof (value as Todo).content === 'string' &&
    typeof (value as Todo).done === 'boolean'
  );
};

export const implFileRepository = (): FileRepository => {
  if (!fs.existsSync(TODO_FILE)) {
    fs.writeFileSync(TODO_FILE, '[]', 'utf-8');
  }

  return {
    readTodos: () => {
      try {
        const raw = fs.readFileSync(TODO_FILE, 'utf-8');
        const parsed: unknown = JSON.parse(raw);

        if (!Array.isArray(parsed) || !parsed.every(todoTypeGuard)) {
          return { state: 'error', detailedError: 'INVALID_JSON_FORMAT' };
        }
        return { state: 'success', data: parsed };
      } catch {
        return { state: 'error', detailedError: 'FILE_READ_FAILED' };
      }
    },
    writeTodos: ({ todos }) => {
      try {
        fs.writeFileSync(TODO_FILE, JSON.stringify(todos, null, 2), 'utf-8');
        return { state: 'success' };
      } catch {
        return { state: 'error', detailedError: 'FILE_WRITE_FAILED' };
      }
    },
  };
};
