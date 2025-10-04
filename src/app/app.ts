import { Component, inject, OnInit } from '@angular/core';
import { TodosStore } from 'store';
import { TodosListComponent } from 'components';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  imports: [TodosListComponent, MatProgressSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly todosStore = inject(TodosStore);
  protected isLoadingSignal = this.todosStore.loading;

  ngOnInit() {
    this.loadTodos();
  }

  private async loadTodos() {
    await this.todosStore.loadAll();
  }
}
