import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosStore } from 'store';
import { TodosService } from 'services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly todosStore = inject(TodosStore);
  protected readonly todosService = inject(TodosService);
  
  constructor() {
    // Test that we can access the store properties
    console.log('TodosStore injected successfully:', {
      todos: this.todosStore.todos(),
      loading: this.todosStore.loading(),
      filter: this.todosStore.filter()
    });
    
    // Test that we can access the service
    console.log('TodosService injected successfully');
    this.todosService.getTodos().subscribe(todos => {
      console.log('Todos from service:', todos);
    });
  }
}
