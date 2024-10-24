import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

interface Props {
  todos: Todo[];
  onAddTodo: (todo: Todo) => Promise<void>;
  handleError: (error: string) => void;
  onTempTodo: (todo: Todo | null) => void;
}

export const TodoForm: React.FC<Props> = ({
  todos,
  onAddTodo,
  handleError,
  onTempTodo,
}) => {
  const [todo, setTodo] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (evnt: React.ChangeEvent<HTMLInputElement>) => {
    handleError('');
    setTodo(evnt.target.value);
    setDisableInput(false);

    return;
  };

  const resetForm = () => {
    setTodo('');
  };

  const handleSubmit = async (evnt: React.FormEvent<HTMLFormElement>) => {
    evnt.preventDefault();
    setDisableInput(true);

    if (!todo.trim()) {
      handleError('Title should not be empty');
      setDisableInput(false);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: todo.trim(),
      completed: false,
    };

    onTempTodo(newTodo);

    try {
      await onAddTodo(newTodo);
      setDisableInput(false);
      resetForm();
      onTempTodo(null);
    } catch (error) {
      setDisableInput(false);
      onTempTodo(null);
      handleError('Unable to add a todo');
    }
  };

  useEffect(() => {
    if (!disableInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disableInput]);

  return (
    <>
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          disabled={disableInput}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todo}
          onChange={handleInput}
        />
      </form>
    </>
  );
};
