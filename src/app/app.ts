import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Simple Todo interface for demonstration
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ngrx-signal-store');
}
