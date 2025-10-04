import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Todo, TODOS } from 'shared';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  private todos: Todo[] = TODOS;

  public getTodos(): Observable<Todo[]> {
    return of([...this.todos]).pipe(delay(500));
  }

  public addTodo(todo: Partial<Todo>): Observable<Todo> {
    const newTodo: Todo = {
      id: Math.random().toString(36).toString(),
      ...todo,
    } as Todo;
    
    return of(newTodo).pipe(
      delay(500)
    );
  }

  public deleteTodo(id: string): Observable<void> {
    // this.todos = this.todos.filter(t => t.id !== id); // <- would be meaningful if BE actually does this, I will be separately deleted from the store, so BE would have to match that here.
    console.log('Pretend to delete todo with id', id);
    return of(void 0).pipe(delay(500));
  }

  public updateTodo(id: string, completed: boolean): Observable<void> {
    console.log('Pretend to update todo with id', id, 'to completed', completed);
    return of(void 0).pipe(delay(500));

  }
}