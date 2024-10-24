/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoForm } from './components/TodoForm/TodoForm';

const FILTER = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>();

  const addTodo = async (todo: Todo): Promise<void> => {
    try {
      await postService
        .addTodos(todo)
        .then(newTodo => setTodos([...todos, newTodo]));
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      throw error;
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      await postService.deleteTodo(todoId);
      setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      throw error;
    }
  };

  const bulkDeleteTodo = async (todoList: Todo[]) => {
    try {
      await Promise.all(todoList.map(todo => postService.deleteTodo(todo.id)));
      setTodos(currentTodos =>
        currentTodos.filter(todo => !todoList.some(t => t.id === todo.id)),
      );
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      throw error;
    }
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case FILTER.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FILTER.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  useEffect(() => {
    postService
      .getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  if (!postService.USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = getFilteredTodos();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoForm
            todos={filteredTodos}
            onAddTodo={addTodo}
            handleError={setErrorMessage}
            onTempTodo={setTempTodo}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={filteredTodos}
            onDelete={deleteTodo}
            tempTodo={tempTodo ? tempTodo : undefined}
          />
        </section>

        {todos.length > 0 && (
          <Footer
            onFilter={setFilter}
            onDelete={bulkDeleteTodo}
            todos={todos}
          />
        )}
      </div>

      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
};
