import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Todo, TodosFilter } from 'shared';
import { TodosService } from 'services';
import { computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

/**
 * Represents the state structure for the Todos feature.
 *
 * @property todos - An array of Todo items.
 * @property loading - Indicates whether the todos are currently being loaded.
 * @property filter - The current filter applied to the todos list.
 */
type TodosState = {
  todos: Todo[];
  loading: boolean;
  filter: TodosFilter;
};

/**
 * The initial state for the Todos feature.
 *
 * @property todos - An array containing all todo items.
 * @property loading - Indicates whether the todos are currently being loaded.
 * @property filter - The current filter applied to the todos list (e.g., 'all', 'pending', 'completed').
 */
const initialState: TodosState = {
  todos: [],
  loading: false,
  filter: 'all',
};

/**
 * A signal-based store for managing the state of todos in the application.
 *
 * @remarks
 * This store provides methods for loading, adding, deleting, and updating todos,
 * as well as updating the current filter. It uses Angular dependency injection to
 * access the `TodosService` for performing asynchronous operations.
 *
 * The store maintains the following state:
 * - `todos`: The list of todo items.
 * - `loading`: Indicates if a loading operation is in progress.
 * - `filter`: The current filter applied to the todos.
 *
 * Computed properties:
 * - `filteredTodos`: Returns the list of todos filtered according to the current filter.
 *
 * Methods:
 * - `loadAll()`: Loads all todos from the service and updates the state.
 * - `add(title: string)`: Adds a new todo with the given title.
 * - `deleteTodo(id: string)`: Deletes a todo by its ID.
 * - `updateTodo(id: string, completed: boolean)`: Updates the completion status of a todo.
 * - `updateFilter(filter: TodosFilter)`: Updates the current filter.
 *
 * @example
 * ```typescript
 * TodosStore.loadAll();
 * TodosStore.add('New Task');
 * TodosStore.deleteTodo('123');
 * TodosStore.updateTodo('123', true);
 * TodosStore.updateFilter('completed');
 * ```
 *
 * @public
 */
export const TodosStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const todosService = inject(TodosService);
    return {
      /**
       * Asynchronously loads all todos and updates the store state.
       *
       * Sets the `loading` state to `true` before fetching todos from the `todosService`.
       * Once the todos are retrieved, updates the store with the fetched todos and sets `loading` to `false`.
       *
       * @returns {Promise<void>} A promise that resolves when the todos have been loaded and the state has been updated.
       */
      async loadAll(): Promise<void> {
        patchState(store, { loading: true });
        const todos = await firstValueFrom(todosService.getTodos());
        patchState(store, { todos, loading: false });
      },

      /**
       * Asynchronously adds a new todo item with the specified title.
       *
       * This method interacts with the `todosService` to create a new todo,
       * then updates the store state by appending the new todo to the existing list.
       * Optionally, loading state management can be enabled by uncommenting the relevant lines.
       *
       * @param title - The title of the todo item to add.
       * @returns A promise that resolves when the todo has been added and the state updated.
       */
      async add(title: string): Promise<void> {
        // patchState(store, { loading: true }); // <- comment out for silent save
        const todo = await firstValueFrom(todosService.addTodo({ title, completed: false }));
        patchState(store, (state) => ({
          todos: [...state.todos, todo],
          // loading: false // <- comment out if silent save
        }));
      },

      /**
       * Deletes a todo item by its ID.
       *
       * This method performs an asynchronous operation to delete a todo item using the provided `todosService`.
       * After successful deletion, it updates the store state by removing the deleted todo from the `todos` array.
       * Optionally, loading state management can be enabled by uncommenting the relevant lines.
       *
       * @param id - The unique identifier of the todo item to delete.
       * @returns A promise that resolves when the deletion and state update are complete.
       */
      async deleteTodo(id: string): Promise<void> {
        // patchState(store, { loading: true }); // <- comment out for silent delete
        await firstValueFrom(todosService.deleteTodo(id));
        patchState(store, (state) => ({
          todos: state.todos.filter((t) => t.id !== id),
          // loading: false // <- comment out if silent delete
        }));
      },

      /**
       * Updates the completion status of a todo item by its ID.
       *
       * This method performs an asynchronous update operation using the `todosService`.
       * After the update is successful, it patches the state to reflect the new completion status
       * of the specified todo item. Optionally, loading state management can be toggled by
       * commenting/uncommenting the relevant lines.
       *
       * @param id - The unique identifier of the todo item to update.
       * @param completed - The new completion status to set for the todo item.
       * @returns A promise that resolves when the update operation is complete.
       */
      async updateTodo(id: string, completed: boolean): Promise<void> {
        // patchState(store, { loading: true }); // <- comment out for silent update
        await firstValueFrom(todosService.updateTodo(id, completed));
        patchState(store, (state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, completed } : t)),
          // loading: false // <- comment out if silent update
        }));
      },

      /**
       * Updates the current filter state for the todos store.
       * Is not asynchronous since it only updates local state.
       *
       * @param filter - The new filter to apply to the todos state.
       */
      updateFilter(filter: TodosFilter) {
        patchState(store, { filter });
      },
    };
  }),
  withComputed((state) => ({
    filteredTodos: computed(() => {
      const todos = state.todos();
      switch (state.filter()) {
        case 'pending':
          return todos.filter((t) => !t.completed);
        case 'completed':
          return todos.filter((t) => t.completed);
        case 'all':
          return todos;
      }
    }),
  })),
);
