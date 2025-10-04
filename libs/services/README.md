# Services Library

Business logic and data services for the NgRx Signal Store Todo Application.

## Overview

This library contains all the services that handle data operations and business logic for the todo application. Services simulate backend interactions with realistic delays.

## Services

### TodosService

Provides CRUD operations for todo items with simulated HTTP delays.

**Methods**:
- `getTodos()`: Retrieve all todo items (Observable<Todo[]>)
- `addTodo(todo: Partial<Todo>)`: Add a new todo item (Observable<Todo>)
- `deleteTodo(id: string)`: Delete a todo by ID (Observable<void>)
- `updateTodo(id: string, completed: boolean)`: Update todo completion status (Observable<Todo>)

**Features**:
- **Simulated Delays**: All operations include realistic 500ms delays
- **Observable-based**: Returns RxJS observables for reactive programming
- **Type Safety**: Full TypeScript integration with Todo model
- **Injectable**: Provided in root for singleton behavior
- **Mock Data**: Uses predefined mock data for demonstration

## Usage

```typescript
import { TodosService } from 'services';
import { Todo } from 'shared';

// In your component or store
const todosService = inject(TodosService);

// Load all todos
todosService.getTodos().subscribe(todos => {
  console.log('Loaded todos:', todos);
});

// Add new todo
todosService.addTodo({ 
  title: 'New task', 
  completed: false 
}).subscribe(newTodo => {
  console.log('Added:', newTodo);
});

// Update todo
todosService.updateTodo('123', true).subscribe(updatedTodo => {
  console.log('Updated:', updatedTodo);
});

// Delete todo
todosService.deleteTodo('123').subscribe(() => {
  console.log('Deleted successfully');
});
```

## Dependencies

- `shared`: Todo model types
- `rxjs`: Observable utilities (of, delay)
- `@angular/core`: Dependency injection

## Mock Data

The service includes predefined mock data for development and testing:
- Sample todo items with different completion states
- Realistic titles and IDs
- Immediate availability for development

## Testing

Run tests using Jest:
```bash
npm test
```

Services include comprehensive unit tests with mocked observables.

## Building

```bash
ng build services
```

## Adding New Services

```bash
ng generate service new-service --project services
```
