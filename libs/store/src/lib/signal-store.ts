
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Todo, TodosFilter } from 'shared';
import { TodosService } from 'services';
import { computed, inject } from '@angular/core';
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
        },

        async add(title: string): Promise<void> {
          // patchState(store, { loading: true }); // <- comment out for silent save
          const todo = await firstValueFrom(todosService.addTodo({ title, completed: false }));
          patchState(store, (state) => ({
            todos: [...state.todos, todo],
            // loading: false // <- comment out if silent save
          }));   
        },

        async deleteTodo(id: string): Promise<void> {
          // patchState(store, { loading: true }); // <- comment out for silent delete
          await firstValueFrom(todosService.deleteTodo(id));
          patchState(store, (state) => ({
            todos: state.todos.filter(t => t.id !== id),
            // loading: false // <- comment out if silent delete
          }));   
        },

        async updateTodo(id: string, completed: boolean): Promise<void> {
          // patchState(store, { loading: true }); // <- comment out for silent update
          await firstValueFrom(todosService.updateTodo(id, completed));
          patchState(store, (state) => ({
            todos: state.todos.map(t => t.id === id ? { ...t, completed } : t),
            // loading: false // <- comment out if silent update
          }));   
        },

        updateFilter(filter: TodosFilter) {
          patchState(store, { filter });
        }
      };
    }),
    withComputed((state) => ({
      filteredTodos: computed(() => {
        const todos = state.todos();
        switch (state.filter()) {
          case 'pending':
            return todos.filter(t => !t.completed);
          case 'completed':
            return todos.filter(t => t.completed);
          case 'all':
            return todos;
        }
      })
    }))
)