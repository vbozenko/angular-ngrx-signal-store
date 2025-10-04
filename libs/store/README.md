# Store Library

State management library for the NgRx Signal Store Todo Application using NgRx Signals.

## Overview

This library contains the reactive state management implementation using NgRx Signal Store, providing a modern alternative to traditional NgRx with reducers and effects.

## Exports

- **`TodosStore`**: Main signal store for managing todos state

## Features

### State Management
- **todos**: Array of todo items
- **loading**: Loading state indicator
- **filter**: Current filter applied to todos ('all', 'pending', 'completed')

### Computed Signals
- **filteredTodos**: Automatically filtered todos based on current filter

### Methods
- `loadAll()`: Load all todos from the service
- `add(title: string)`: Add a new todo item
- `deleteTodo(id: string)`: Delete a todo by ID
- `updateTodo(id: string, completed: boolean)`: Update todo completion status
- `updateFilter(filter: TodosFilter)`: Change the current filter

## Usage

```typescript
import { TodosStore } from 'store';

// In your component
const store = inject(TodosStore);

// Access state
const todos = store.todos();
const loading = store.loading();
const filteredTodos = store.filteredTodos();

// Perform actions
store.loadAll();
store.add('New todo');
store.updateFilter('completed');
```

## Dependencies

- `@ngrx/signals`: Modern NgRx signal store
- `services`: TodosService for data operations
- `shared`: Todo and TodosFilter types

## Testing

Run tests using Jest:
```bash
npm test
```

The store includes comprehensive test coverage for all methods and state transitions.

## Building

```bash
ng build store
```
