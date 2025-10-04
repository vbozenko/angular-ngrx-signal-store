# Components Library

Reusable UI components for the NgRx Signal Store Todo Application built with Angular Material.

## Overview

This library contains all the UI components used in the todo application, designed to be reusable and fully integrated with the NgRx Signal Store.

## Components

### TodosListComponent

The main component for displaying and managing the todo list.

**Selector**: `todos-list`

**Features**:
- Display filtered todos based on current store filter
- Add new todo items
- Toggle todo completion status
- Delete todo items
- Filter todos by status (All, Pending, Completed)
- Material Design UI with Angular Material components

**Dependencies**:
- Angular Material components (MatFormField, MatInput, MatIcon, MatButtonToggle, MatList, MatCheckbox)
- Reactive integration with TodosStore
- Signal-based reactivity

## Usage

```typescript
import { TodosListComponent } from 'components';

@Component({
  selector: 'app-root',
  imports: [TodosListComponent],
  template: `<todos-list></todos-list>`
})
export class App {}
```

```html
<todos-list></todos-list>
```

## Component Architecture

- **Signal Integration**: Uses Angular signals for reactive UI updates
- **Store Integration**: Directly connected to TodosStore for state management
- **Material Design**: Built with Angular Material for consistent styling
- **Type Safety**: Full TypeScript integration with shared models

## Styling

Components use Angular Material theming and include custom SCSS for todo-specific styling.

## Testing

Run tests using Jest:
```bash
npm test
```

Components include comprehensive unit tests with mocked dependencies.

## Building

```bash
ng build components
```

## Adding New Components

```bash
ng generate component new-component --project components
```
