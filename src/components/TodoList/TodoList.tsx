/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  tempTodo?: Todo;
  todos: Todo[];
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({ todos, onDelete, tempTodo }) => {
  return todos.map(todo => (
    // eslint-disable-next-line react/jsx-key
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${tempTodo ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
      </div>
    </div>
  ));
};
