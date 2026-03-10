import type { InputRepository } from '../domain/input-interface';

export const implInputRepository = (): InputRepository => ({
  parseCommand: () => {
    const args = process.argv.slice(2);
    const command = args[0];

    if (command === undefined) {
      return { state: 'success', data: { state: 'HELP' } };
    }

    switch (command) {
      case 'add': {
        const content = args[1];
        if (content === undefined) {
          return { state: 'error', detailedError: 'NO_CONTENT_IN_ADD' };
        }
        return { state: 'success', data: { state: 'ADD_TODO', content } };
      }

      case 'list': {
        return { state: 'success', data: { state: 'READ_TODOS' } };
      }

      case 'done': {
        if (args[1] === undefined) {
          return { state: 'error', detailedError: 'NO_ID_IN_DONE' };
        }
        const id = parseInt(args[1], 10);
        if (isNaN(id)) {
          return { state: 'error', detailedError: 'INVALID_ID_IN_DONE' };
        }
        return { state: 'success', data: { state: 'UPDATE_DONE', id } };
      }

      case 'delete': {
        if (args[1] === undefined) {
          return { state: 'error', detailedError: 'NO_ID_IN_DELETE' };
        }
        const id = parseInt(args[1], 10);
        if (isNaN(id)) {
          return { state: 'error', detailedError: 'INVALID_ID_IN_DELETE' };
        }
        return { state: 'success', data: { state: 'DELETE', id } };
      }

      case 'update': {
        if (args[1] === undefined) {
          return { state: 'error', detailedError: 'NO_ID_IN_UPDATE' };
        }
        const id = parseInt(args[1], 10);
        const newContent = args[2];
        if (isNaN(id) || newContent === undefined) {
          return { state: 'error', detailedError: 'INVALID_ID_IN_UPDATE' };
        }
        return { state: 'success', data: { state: 'UPDATE', id, newContent } };
      }
      default:
        return { state: 'error', detailedError: 'INVALID_COMMAND' };
    }
  },
});
