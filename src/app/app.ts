import { Component, inject, OnInit } from '@angular/core';
import { TodosStore } from 'store';
import { TodosService } from 'services';
import { TodosListComponent } from 'components';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  imports: [TodosListComponent, MatSpinner],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly todosStore = inject(TodosStore);
  protected readonly todosService = inject(TodosService);
  
  constructor() {
    // // Test that we can access the store properties
    // console.log('TodosStore injected successfully:', {
    //   todos: this.todosStore.todos(),
    //   loading: this.todosStore.loading(),
    //   filter: this.todosStore.filter()
    // });
    
    // // Test that we can access the service
    // console.log('TodosService injected successfully');
    // this.todosService.getTodos().subscribe(todos => {
    //   console.log('Todos from service:', todos);
    // });
  }

  ngOnInit() {
    this.loadTodos()
    .then(() => {
      console.log('Todos loaded successfully:', this.todosStore.todos());
    })
    .catch(error => {
      console.error('Error loading todos:', error);
    });
    
  }

  private async loadTodos() {
    await this.todosStore.loadAll();
  }
}
