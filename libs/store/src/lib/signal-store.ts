
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Todo, TodosFilter } from 'shared';
import { TodosService } from 'services';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

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
    withMethods((store) => {
      const todosService = inject(TodosService);
      return {
        async loadAll(): Promise<void> {
          patchState(store, { loading: true });
          const todos = await firstValueFrom(todosService.getTodos());
          patchState(store, { todos, loading: false });
        }
      };
    })
)