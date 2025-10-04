import { Component, effect, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleChange, MatButtonToggleGroup, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TodosStore } from 'store';
import { TodosFilter } from 'shared';

@Component({
  selector: 'todos-list',
  imports: [
    CommonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    MatButtonToggleModule, 
    MatListModule,
    MatCheckboxModule
  ],
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss']
})
export class TodosListComponent {
  public store = inject(TodosStore);

  private filterSignal = viewChild.required('toggleFilterButtons', {
    read: MatButtonToggleGroup,
  });

  constructor() {
    effect(() => {
      const filter = this.filterSignal();
      filter.value = this.store.filter();
    });
  }

  public async onAddTodo(title: string): Promise<void> {
    return await this.store.add(title);
  }

  public async onDeleteTodo(id: string): Promise<void> {
    return await this.store.deleteTodo(id);
  }

  public async onToggleTodo(id: string, completed: boolean): Promise<void> {
    return await this.store.updateTodo(id, completed);
  }

  public onFilterTodos(event: MatButtonToggleChange): void {
    const filter: TodosFilter = event.value;
    this.store.updateFilter(filter);
  }
}