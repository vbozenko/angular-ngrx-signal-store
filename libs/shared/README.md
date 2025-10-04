# Shared Library

Common models, types, and utilities for the NgRx Signal Store Todo Application.

## Overview

This library contains all the shared models, types, and utility functions used across the todo application. It provides type safety and consistency throughout the application.

## Exports

### Models

#### Todo
The main data model for todo items.

```typescript
export type Todo = {
  id: string;        // Unique identifier
  title: string;     // Todo description
  completed: boolean; // Completion status
};
```

#### TodosFilter
Type for filtering todo items by status.

```typescript
export type TodosFilter = 'all' | 'pending' | 'completed';
```

### Utilities

Additional shared utilities and helper functions (exported from `shared.ts`).

## Usage

```typescript
import { Todo, TodosFilter } from 'shared';

// Define a todo
const newTodo: Todo = {
  id: '123',
  title: 'Learn NgRx Signals',
  completed: false
};

// Use filter type
const currentFilter: TodosFilter = 'pending';

// Type-safe operations
function filterTodos(todos: Todo[], filter: TodosFilter): Todo[] {
  switch (filter) {
    case 'all':
      return todos;
    case 'pending':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}
```

## Type Safety Benefits

- **Consistent Data Structure**: Ensures all parts of the app use the same Todo structure
- **Filter Validation**: TodosFilter type prevents invalid filter values
- **IDE Support**: Full IntelliSense and autocomplete support
- **Compile-time Checking**: Catches type errors during development

## File Structure

```
src/lib/
├── shared.ts                 # Utility functions and exports
└── models/
    ├── todo.model.ts        # Todo type definition
    └── todos-filter.model.ts # TodosFilter type definition
```

## Dependencies

This library has no external dependencies, ensuring minimal bundle size and maximum compatibility.

## Testing

Run tests using Jest:
```bash
npm test
```

## Building

```bash
ng build shared
```

## Adding New Models

```bash
ng generate interface new-model --project shared
```

Add new models to the `models/` directory and export them through `public-api.ts`.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
