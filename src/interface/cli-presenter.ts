import type { CliPresenter, CliRepository } from '../domain/cli-interface';
import type { DETAILED_ERROR } from '../domain/detailed-error';
import type { TodoUsecase } from '../domain/todo-interface';

const showAllCommands = () => {
  console.log('사용법:');
  console.log('  node todo.js add "할 일 내용"    - Todo 추가');
  console.log('  node todo.js list                - 전체 목록 조회');
  console.log('  node todo.js done [ID]           - 완료 처리');
  console.log('  node todo.js delete [ID]         - 삭제 (선택 기능)');
  console.log('  node todo.js update [ID] "내용"  - 내용 수정 (선택 기능)');
};

const showDetailedError = (error: DETAILED_ERROR) => {
  switch (error) {
    case 'NO_CONTENT_IN_ADD': {
      console.log('오류: 추가할 Todo 내용을 입력하세요.');
      return;
    }
    case 'NO_ID_IN_DONE': {
      console.log('오류: ID를 반드시 입력하세요.');
      return;
    }
    case 'INVALID_ID_IN_DONE': {
      console.log('오류: 유효한 ID를 숫자로 입력하세요.');
      return;
    }
    case 'NO_ID_IN_DELETE': {
      console.log('오류: ID를 반드시 입력하세요.');
      return;
    }
    case 'INVALID_ID_IN_DELETE': {
      console.log('오류: 유효한 ID를 숫자로 입력하세요.');
      return;
    }
    case 'NO_ID_IN_UPDATE': {
      console.log('오류: ID를 반드시 입력하세요.');
      return;
    }
    case 'INVALID_ID_IN_UPDATE': {
      console.log('오류: 유효한 ID와 내용을 입력하세요.');
      return;
    }
    case 'INVALID_COMMAND': {
      console.log('오류: 알 수 없는 명령어입니다.');
      return;
    }
    case 'INVALID_JSON_FORMAT': {
      console.log('오류: todos.json 파일 형식이 올바르지 않습니다.');
      return;
    }
    case 'FILE_READ_FAILED': {
      console.log('오류: 파일을 읽을 수 없습니다.');
      return;
    }
    case 'FILE_WRITE_FAILED': {
      console.log('오류: 파일을 저장할 수 없습니다.');
      return;
    }
    case 'NOT_FOUND_ID_IN_DONE': {
      console.log('오류: 해당 ID의 Todo를 찾을 수 없습니다.');
      return;
    }
    case 'NOT_FOUND_ID_IN_DELETE': {
      console.log('오류: 해당 ID의 Todo를 찾을 수 없습니다.');
      return;
    }
    case 'NOT_FOUND_ID_IN_UPDATE': {
      console.log('오류: 해당 ID의 Todo를 찾을 수 없습니다.');
      return;
    }
  }
};

const showDetailedInfo = (detailedError: DETAILED_ERROR): void => {
  switch (detailedError) {
    case 'NO_CONTENT_IN_ADD': {
      console.log('사용법: node todo.js add "할 일 내용"');
      return;
    }
    case 'NO_ID_IN_DONE': {
      console.log('사용법: node todo.js done [ID]');
      return;
    }
    case 'INVALID_ID_IN_DONE': {
      console.log('사용법: node todo.js done [ID]');
      return;
    }
    case 'NO_ID_IN_DELETE': {
      console.log('사용법: node todo.js delete [ID]');
      return;
    }
    case 'INVALID_ID_IN_DELETE': {
      console.log('사용법: node todo.js delete [ID]');
      return;
    }
    case 'NO_ID_IN_UPDATE': {
      console.log('사용법: node todo.js update [ID] "새 내용"');
      return;
    }
    case 'INVALID_ID_IN_UPDATE': {
      console.log('사용법: node todo.js update [ID] "새 내용"');
      return;
    }
    case 'INVALID_COMMAND': {
      showAllCommands();
      return;
    }
  }
};

export const implCliPresenter = ({
  cliRepository,
  todoUsecase,
}: {
  cliRepository: CliRepository;
  todoUsecase: TodoUsecase;
}): CliPresenter => ({
  run: () => {
    const result = cliRepository.parseCommand();

    if (result.state === 'error') {
      const { detailedError } = result;
      showDetailedError(detailedError);
      showDetailedInfo(detailedError);
    }

    if (result.state === 'success') {
      const { state } = result.data;
      switch (state) {
        case 'HELP': {
          showAllCommands();
          return;
        }
        case 'ADD_TODO': {
          const { content } = result.data;
          const response = todoUsecase.addTodo({ content });
          if (response.state === 'error') {
            showDetailedError(response.detailedError);
            return;
          }
          console.log(`Todo가 추가되었습니다.: ${content}`);
          return;
        }
        case 'READ_TODOS': {
          const response = todoUsecase.listTodos();
          if (response.state === 'error') {
            showDetailedError(response.detailedError);
            return;
          }
          const { data: todos } = response;
          todos.forEach((todo) => {
            const status = todo.done ? '[x]' : '[ ]';
            console.log(`${status} ${todo.id}. ${todo.content}`);
          });
          return;
        }
        case 'UPDATE_DONE': {
          const { id } = result.data;
          const response = todoUsecase.doneTodo({ id });
          if (response.state === 'error') {
            showDetailedError(response.detailedError);
            return;
          }
          console.log(`ID ${id}번 항목이 완료되었습니다.`);
          return;
        }
        case 'UPDATE': {
          const { id, newContent } = result.data;
          const response = todoUsecase.updateTodo({ id, newContent });
          if (response.state === 'error') {
            showDetailedError(response.detailedError);
            return;
          }
          const { oldContent } = response.data;
          console.log(
            `ID ${id}번 항목이 수정되었습니다: "${oldContent}" → "${newContent}"`
          );
          return;
        }
        case 'DELETE': {
          const { id } = result.data;
          const response = todoUsecase.deleteTodo({ id });
          if (response.state === 'error') {
            showDetailedError(response.detailedError);
            return;
          }
          const {
            data: { removedContent },
          } = response;
          console.log(`ID ${id}번 항목이 삭제되었습니다: ${removedContent}`);
          return;
        }
      }
    }
  },
});
