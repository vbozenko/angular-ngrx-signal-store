import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Todo, TODOS } from 'shared';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  private todos: Todo[] = TODOS;

  getTodos(): Observable<Todo[]> {
    return of([...this.todos]).pipe(delay(500));
  }
}