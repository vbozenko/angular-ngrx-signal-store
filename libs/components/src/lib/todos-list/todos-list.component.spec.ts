import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodosListComponent } from './todos-list.component';
import { TodosStore } from 'store';
import { TodosService } from 'services';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Todo, TodosFilter } from 'shared';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('TodosListComponent', () => {
  let component: TodosListComponent;
  let fixture: ComponentFixture<TodosListComponent>;
  let store: InstanceType<typeof TodosStore>;
  let mockTodosService: Partial<TodosService>;

  // Mock todos for testing
  const mockTodos: Todo[] = [
    { id: '1', title: 'Test Todo 1', completed: false },
    { id: '2', title: 'Test Todo 2', completed: true },
    { id: '3', title: 'Test Todo 3', completed: false },
  ];

  beforeEach(async () => {
    // Mock TodosService following NgRx patterns - mock the dependency, not the store
    mockTodosService = {
      getTodos: jest.fn().mockReturnValue(of(mockTodos)),
      addTodo: jest
        .fn()
        .mockImplementation((todo) => of({ ...todo, id: Math.random().toString() })),
      deleteTodo: jest.fn().mockReturnValue(of(undefined)),
      updateTodo: jest.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [TodosListComponent],
      providers: [TodosStore, { provide: TodosService, useValue: mockTodosService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodosListComponent);
    component = fixture.componentInstance;

    // Inject the real store following NgRx pattern
    store = TestBed.inject(TodosStore);

    fixture.detectChanges();

    // Use TestBed.tick() to ensure effects are processed
    TestBed.tick();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize properly with store', () => {
      // Component should be created without errors
      expect(component).toBeDefined();
      // Verify store signals exist (they will be called during component lifecycle)
      expect(store.filteredTodos).toBeDefined();
      expect(store.filter).toBeDefined();
    });
  });

  describe('Store Integration', () => {
    it('should initialize with store signals without errors', () => {
      // Verify that the component can access store signals through its constructor
      expect(component).toBeTruthy();
      // Verify store signals are accessible
      expect(store.filteredTodos).toBeDefined();
      expect(store.filter).toBeDefined();
      expect(store.loading).toBeDefined();
      expect(store.todos).toBeDefined();
    });

    it('should have initial store state', () => {
      // Verify signals have initial values
      expect(store.filter()).toBe('all');
      expect(store.loading()).toBe(false);
      expect(store.todos()).toEqual([]);
    });

    it('should handle store filter changes', () => {
      // Test that filter changes work through store methods
      const newFilter: TodosFilter = 'pending';
      store.updateFilter(newFilter);

      // Trigger change detection and tick to process effects
      fixture.detectChanges();
      TestBed.tick();

      // Verify the filter was updated
      expect(store.filter()).toBe(newFilter);

      // Component should remain stable
      expect(component).toBeTruthy();
    });

    it('should load todos through store', async () => {
      // Test loading todos through the store
      await store.loadAll();

      fixture.detectChanges();
      TestBed.tick();

      // Verify service was called and todos were loaded
      expect(mockTodosService.getTodos).toHaveBeenCalled();
      expect(store.todos()).toEqual(mockTodos);
    });
  });

  describe('Todo Management Methods', () => {
    describe('onAddTodo', () => {
      it('should call store.add with provided title', async () => {
        const title = 'New Test Todo';
        const spy = jest.spyOn(store, 'add');

        await component.onAddTodo(title);

        expect(spy).toHaveBeenCalledWith(title);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(mockTodosService.addTodo).toHaveBeenCalled();
      });

      it('should return a promise that resolves', async () => {
        const title = 'New Test Todo';

        const result = component.onAddTodo(title);

        expect(result).toBeInstanceOf(Promise);
        await expect(result).resolves.toBeUndefined();
      });

      it('should handle empty title', async () => {
        const title = '';
        const spy = jest.spyOn(store, 'add');

        await component.onAddTodo(title);

        expect(spy).toHaveBeenCalledWith(title);
        expect(mockTodosService.addTodo).toHaveBeenCalledWith({ title, completed: false });
      });
    });

    describe('onDeleteTodo', () => {
      it('should call store.deleteTodo with provided id', async () => {
        const todoId = '1';
        const spy = jest.spyOn(store, 'deleteTodo');

        await component.onDeleteTodo(todoId);

        expect(spy).toHaveBeenCalledWith(todoId);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(mockTodosService.deleteTodo).toHaveBeenCalledWith(todoId);
      });

      it('should return a promise that resolves', async () => {
        const todoId = '1';

        const result = component.onDeleteTodo(todoId);

        expect(result).toBeInstanceOf(Promise);
        await expect(result).resolves.toBeUndefined();
      });
    });

    describe('onToggleTodo', () => {
      it('should call store.updateTodo with provided id and completion status', async () => {
        const todoId = '1';
        const completed = true;
        const spy = jest.spyOn(store, 'updateTodo');

        await component.onToggleTodo(todoId, completed);

        expect(spy).toHaveBeenCalledWith(todoId, completed);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(mockTodosService.updateTodo).toHaveBeenCalledWith(todoId, completed);
      });

      it('should handle toggling to false', async () => {
        const todoId = '2';
        const completed = false;
        const spy = jest.spyOn(store, 'updateTodo');

        await component.onToggleTodo(todoId, completed);

        expect(spy).toHaveBeenCalledWith(todoId, completed);
        expect(mockTodosService.updateTodo).toHaveBeenCalledWith(todoId, completed);
      });

      it('should return a promise that resolves', async () => {
        const todoId = '1';
        const completed = true;

        const result = component.onToggleTodo(todoId, completed);

        expect(result).toBeInstanceOf(Promise);
        await expect(result).resolves.toBeUndefined();
      });
    });
  });

  describe('Filter Management', () => {
    describe('onFilterTodos', () => {
      it('should call store.updateFilter with filter value from event', () => {
        const mockEvent: MatButtonToggleChange = {
          value: 'pending',
          source: null as unknown as MatButtonToggleChange['source'],
        };
        const spy = jest.spyOn(store, 'updateFilter');

        component.onFilterTodos(mockEvent);

        expect(spy).toHaveBeenCalledWith('pending');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(store.filter()).toBe('pending');
      });

      it('should handle all filter values', () => {
        const filters: TodosFilter[] = ['all', 'pending', 'completed'];
        const spy = jest.spyOn(store, 'updateFilter');

        filters.forEach((filter) => {
          const mockEvent: MatButtonToggleChange = {
            value: filter,
            source: null as unknown as MatButtonToggleChange['source'],
          };

          component.onFilterTodos(mockEvent);

          expect(spy).toHaveBeenCalledWith(filter);
          expect(store.filter()).toBe(filter);
        });

        expect(spy).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle store add method calls', async () => {
      // Test that the component calls the store method
      const spy = jest.spyOn(store, 'add');

      await component.onAddTodo('Test Todo');

      expect(spy).toHaveBeenCalledWith('Test Todo');
    });

    it('should handle store deleteTodo method calls', async () => {
      const spy = jest.spyOn(store, 'deleteTodo');

      await component.onDeleteTodo('1');

      expect(spy).toHaveBeenCalledWith('1');
    });

    it('should handle store updateTodo method calls', async () => {
      const spy = jest.spyOn(store, 'updateTodo');

      await component.onToggleTodo('1', true);

      expect(spy).toHaveBeenCalledWith('1', true);
    });
  });

  describe('Template Integration', () => {
    it('should render component template without errors', () => {
      // Test that the component template renders correctly with the mocked store
      const compiled = fixture.nativeElement;
      expect(compiled).toBeTruthy();

      // Verify that the component doesn't throw when interacting with DOM elements
      const elements = fixture.debugElement.queryAll(By.css('*'));
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should handle template interactions with mock store', () => {
      // Test that template bindings work with the mocked store signals
      fixture.detectChanges();
      TestBed.tick();

      // Component should be stable after template processing
      expect(() => {
        fixture.detectChanges();
        TestBed.tick();
      }).not.toThrow();
    });
  });
});
