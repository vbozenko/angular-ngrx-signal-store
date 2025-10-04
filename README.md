# NgRx Signal Store Todo Application

A modern Angular Todo application demonstrating the use of NgRx Signal Store for state management. This project showcases a monorepo architecture with multiple Angular libraries and comprehensive testing using Jest.

## 🚀 Features

- **Signal Store**: Built with NgRx Signal Store for reactive state management
- **Todo Management**: Add, delete, toggle completion, and filter todos
- **Monorepo Structure**: Organized into separate libraries (components, services, store, shared)
- **Angular Material**: Modern UI components for a polished experience
- **Jest Testing**: Comprehensive test coverage with Jest instead of Karma
- **ESLint & Stylelint**: Code quality and styling enforcement

## 📁 Project Structure

```
├── src/                    # Main application
├── libs/
│   ├── components/         # Reusable UI components library
│   ├── services/           # Business logic and data services library
│   ├── store/             # NgRx Signal Store implementation
│   └── shared/            # Shared models and utilities
└── coverage/              # Test coverage reports
```

## 🛠 Development

### Development Server

Start the development server:

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you make changes.

### Building

Build the application for production:

```bash
npm run build
# or
ng build
```

Build artifacts will be stored in the `dist/` directory.

### Watch Mode

For continuous building during development:

```bash
npm run watch
# or
ng build --watch --configuration development
```

## 🧪 Testing

This project uses Jest for testing instead of the default Karma/Jasmine setup.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in parallel and verbose
npm run test:parallel

# Run tests serially (debugging)
npm run test:serial
```

### Coverage Reports

Test coverage reports are generated in the `coverage/` directory and include:
- HTML reports for browser viewing
- LCOV reports for CI/CD integration

## 🔧 Code Quality

### Linting

```bash
# Lint TypeScript and styles
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Lint only TypeScript
npm run lint:ts

# Lint only styles (CSS/SCSS)
npm run lint:styles
```

## 📚 Library Development

This project supports Angular library development. Each feature is organized into its own library:

### Creating New Libraries

```bash
ng generate library <library-name>

# With custom prefix for component selectors
ng generate library my-feature --prefix=my-lib

# Dry run to see what would be created
ng generate library my-feature --dry-run
```

### Available Libraries

- **components**: UI components (TodosListComponent)
- **services**: Business logic (TodosService)
- **store**: State management (TodosStore using NgRx Signals)
- **shared**: Common models and utilities (Todo, TodosFilter types)

### Library Path Mappings

Import libraries using simple paths:
```typescript
import { TodosStore } from 'store';
import { TodosService } from 'services';
import { TodosListComponent } from 'components';
import { Todo, TodosFilter } from 'shared';
```

## 🏗 Architecture

- **NgRx Signal Store**: Modern reactive state management
- **Dependency Injection**: Clean separation of concerns
- **Angular Material**: Consistent UI components
- **RxJS**: Reactive programming patterns
- **TypeScript**: Type-safe development

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm run watch` | Build in watch mode |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Lint code and styles |
| `npm run lint:fix` | Auto-fix linting issues |

## 🔗 Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [NgRx Signals Documentation](https://ngrx.io/guide/signals)
- [Angular Material Documentation](https://material.angular.io/)
- [Jest Testing Framework](https://jestjs.io/)
