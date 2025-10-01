
import { signalStore, withState } from '@ngrx/signals';
import { Todo, TodosFilter } from 'shared';

type TodosState = {
  todos: Todo[];
  loading: boolean;
  filter: TodosFilter;
};

const initialState: TodosState = {
  todos: [],
  loading: false,
  filter: 'all',
};

export const TodosStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
)