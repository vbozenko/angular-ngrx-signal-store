# Jest Testing Setup for Angular

This project has been configured to use Jest instead of Jasmine/Karma for testing Angular components.

## What was changed?

### Dependencies
- **Removed:** `@types/jasmine`, `jasmine-core`, `karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`
- **Added:** `jest`, `@types/jest`, `jest-environment-jsdom`, `jest-preset-angular`, `ts-jest`, `@jest/globals`

### Configuration Files
- **`jest.config.js`**: Main Jest configuration
- **`setup-jest.ts`**: Jest setup file with Angular testing environment
- **`package.json`**: Updated scripts to use Jest
- **`angular.json`**: Removed Karma test configuration
- **`tsconfig.spec.json`**: Updated to use Jest types instead of Jasmine

## Available Commands

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Features

### Zoneless Change Detection Support
This setup supports Angular's zoneless change detection, which is enabled in your app. The Jest environment is properly configured to work with `provideZonelessChangeDetection()`.

### Coverage Reports
Coverage reports are generated in the `coverage/` directory with HTML, text-summary, and LCOV formats.

### Mocked Browser APIs
Common browser APIs are automatically mocked:
- `matchMedia` (for Angular Material compatibility)
- `ResizeObserver` (for modern Angular components)

## Writing Tests

### Component Tests
```typescript
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MyComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
```

### Service Tests
```typescript
import { TestBed } from '@angular/core/testing';
import { MyService } from './my-service';

describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

### Unit Tests (Models, Utilities)
```typescript
import { MyUtility } from './my-utility';

describe('MyUtility', () => {
  it('should perform calculation', () => {
    const result = MyUtility.calculate(2, 3);
    expect(result).toBe(5);
  });
});
```

## Jest Matchers

Jest provides powerful matchers for assertions:

```typescript
// Basic matchers
expect(value).toBe(4);
expect(value).toEqual({ name: 'John' });
expect(value).toBeNull();
expect(value).toBeDefined();
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// String matchers
expect('Hello World').toContain('World');
expect('Hello World').toMatch(/World/);

// Array matchers
expect(['a', 'b', 'c']).toHaveLength(3);
expect(['a', 'b', 'c']).toContain('b');
expect(array).toContainEqual({ id: 1, name: 'John' });

// Object matchers
expect(object).toMatchObject({ name: 'John' });
expect(object).toHaveProperty('name', 'John');

// Function matchers
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(2);
```

## Mocking

### Mock Functions
```typescript
const mockFn = jest.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue('async result');
```

### Mock Modules
```typescript
jest.mock('./my-service', () => ({
  MyService: jest.fn().mockImplementation(() => ({
    getData: jest.fn().mockReturnValue('mocked data')
  }))
}));
```

## Migration Notes

If you're migrating existing Jasmine tests to Jest:

1. **Replace Jasmine imports**: No need to import Jest functions (they're global)
2. **Update spy syntax**: 
   - Jasmine: `spyOn(obj, 'method')`
   - Jest: `jest.spyOn(obj, 'method')`
3. **Update mock syntax**:
   - Jasmine: `jasmine.createSpy()`
   - Jest: `jest.fn()`
4. **Update matchers**: Most Jasmine matchers work in Jest, but some have different names

## Troubleshooting

### Common Issues

1. **Module resolution errors**: Check `moduleNameMapper` in `jest.config.js`
2. **Zone.js conflicts**: This setup uses zoneless testing to avoid Zone.js conflicts
3. **ESM module errors**: Configure `transformIgnorePatterns` for problematic modules

### Performance Tips

- Use `--maxWorkers` to control parallel test execution
- Use `--testPathIgnorePatterns` to exclude unnecessary files
- Use `--bail` to stop on first test failure during development