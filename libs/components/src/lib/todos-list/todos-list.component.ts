import { Component, effect, inject, Signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  MatButtonToggleChange,
  MatButtonToggleGroup,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TodosStore } from 'store';
import { Todo, TodosFilter } from 'shared';

/**
 * Component for displaying and managing a list of todos.
 *
 * @remarks
 * This component provides UI and logic for displaying a list of todo items, adding new todos,
 * deleting existing ones, toggling their completion status, and filtering the list based on the selected filter.
 * It leverages Angular Material components for UI and interacts with a `TodosStore` for state management.
 *
 * @example
 * ```html
 * <todos-list></todos-list>
 * ```
 *
 * @public
 */
@Component({
  selector: 'todos-list',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonToggleModule,
    MatListModule,
    MatCheckboxModule,
  ],
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss'],
})
export class TodosListComponent {
  protected filteredTodosSignal!: Signal<Todo[]>;
  /**
   * Injected instance of the `TodosStore` service, providing access to the todos state and actions.
   *
   * @remarks
   * This store is used to manage the state and business logic for the todos list component.
   *
   * @private
   */
  private store = inject(TodosStore);

  /**
   * Reference to the `MatButtonToggleGroup` instance associated with the 'toggleFilterButtons' template reference variable.
   *
   * This property is initialized using the `viewChild.required` method, ensuring that the referenced button toggle group
   * is present in the component's template. It is typically used to programmatically interact with the filter buttons group,
   * such as reading or updating its state.
   *
   * @private
   */
  private refFilterButtons = viewChild.required('toggleFilterButtons', {
    read: MatButtonToggleGroup,
  });

  /**
   * Initializes the TodosListComponent by assigning the filtered todos signal from the store
   * and setting up an effect to synchronize the filter value with the store's filter.
   *
   * The effect observes changes to the filter signal and updates the value of the
   * refFilterButtons signal accordingly.
   */
  constructor() {
    this.filteredTodosSignal = this.store.filteredTodos;

    effect(() => {
      const filter = this.refFilterButtons(); // the value of the refFilterButtons signal
      filter.value = this.store.filter();
    });
  }

  /**
   * Adds a new todo item with the specified title to the store.
   *
   * @param title - The title of the todo item to add.
   * @returns A promise that resolves when the todo has been added.
   */
  public async onAddTodo(title: string): Promise<void> {
    return await this.store.add(title);
  }

  /**
   * Deletes a todo item by its unique identifier.
   *
   * @param id - The unique identifier of the todo item to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  public async onDeleteTodo(id: string): Promise<void> {
    return await this.store.deleteTodo(id);
  }

  /**
   * Toggles the completion status of a todo item.
   *
   * @param id - The unique identifier of the todo item to update.
   * @param completed - The new completion status to set for the todo item.
   * @returns A promise that resolves when the update operation is complete.
   */
  public async onToggleTodo(id: string, completed: boolean): Promise<void> {
    return await this.store.updateTodo(id, completed);
  }

  /**
   * Handles the filter change event from the MatButtonToggle component.
   * Updates the todos filter in the store based on the selected filter value.
   *
   * @param event - The change event emitted by the MatButtonToggle, containing the selected filter value.
   */
  public onFilterTodos(event: MatButtonToggleChange): void {
    const filter: TodosFilter = event.value;
    this.store.updateFilter(filter);
  }
}
