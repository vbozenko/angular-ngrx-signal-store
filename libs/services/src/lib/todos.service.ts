import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Todo, TODOS } from 'shared';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  /**
   * An array of Todo items initialized with the default TODOS.
   *
   * @private
   * @remarks
   * This property holds the current list of todos managed by the service.
   * It is initialized with the predefined `TODOS` constant.
   */
  private todos: Todo[] = TODOS;

  /**
   * Retrieves the list of todos.
   *
   * @remarks
   * This method simulates fetching todos from a backend by returning a copy of the current
   * todos array as an observable, with a simulated network delay of 500 milliseconds.
   *
   * @returns An `Observable` that emits an array of `Todo` objects after a delay.
   */
  public getTodos(): Observable<Todo[]> {
    console.log('Pretend to fetch todos from backend');

    return of([...this.todos]).pipe(delay(500));
  }

  /**
   * Adds a new todo item.
   *
   * This method creates a new `Todo` object by merging the provided partial `todo` data
   * with a randomly generated `id`. It simulates adding the todo by logging the new item
   * and returns an observable that emits the new todo after a 500ms delay.
   *
   * @param todo - A partial `Todo` object containing the properties to set on the new todo.
   * @returns An `Observable` that emits the newly created `Todo` object after a delay.
   */
  public addTodo(todo: Partial<Todo>): Observable<Todo> {
    const newTodo: Todo = {
      id: Math.random().toString(36).toString(),
      ...todo,
    } as Todo;

    console.log('Pretend to add todo', newTodo);

    return of(newTodo).pipe(delay(500));
  }

  /**
   * Deletes a todo item by its unique identifier.
   *
   * This method simulates the deletion of a todo item by logging the action and returning
   * an observable that completes after a short delay. No actual backend operation is performed.
   *
   * @param id - The unique identifier of the todo item to delete.
   * @returns An Observable that completes when the simulated deletion is done.
   */
  public deleteTodo(id: string): Observable<void> {
    // this.todos = this.todos.filter(t => t.id !== id); // <- would be meaningful if BE actually does this, it will be separately deleted from the store, so BE would have to match that here.
    console.log('Pretend to delete todo with id', id);

    return of(void 0).pipe(delay(500));
  }

  /**
   * Updates the completion status of a todo item by its ID.
   *
   * @param id - The unique identifier of the todo item to update.
   * @param completed - The new completion status to set for the todo item.
   * @returns An Observable that completes when the update operation is finished.
   */
  public updateTodo(id: string, completed: boolean): Observable<void> {
    console.log('Pretend to update todo with id', id, 'to completed', completed);

    return of(void 0).pipe(delay(500));
  }
}
