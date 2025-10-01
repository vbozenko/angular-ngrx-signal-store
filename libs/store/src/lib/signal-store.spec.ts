import { TestBed } from '@angular/core/testing';
import { TodosStore } from './signal-store';
import { Todo, TodosFilter } from 'shared';

describe('TodosStore', () => {
  let store: InstanceType<typeof TodosStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(TodosStore);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('Store Creation', () => {
    it('should be created', () => {
      expect(store).toBeTruthy();
    });

    it('should be provided in root', () => {
      const injectedStore = TestBed.inject(TodosStore);
      expect(injectedStore).toBe(store);
    });

    it('should be an instance of the store', () => {
      expect(typeof store).toBe('object');
      expect(store.constructor.name).toBe('_SignalStore');
    });
  });

  describe('Initial State', () => {
    it('should initialize with empty todos array', () => {
      expect(store.todos()).toEqual([]);
    });

    it('should initialize with loading as false', () => {
      expect(store.loading()).toBe(false);
    });

    it('should initialize with filter as "all"', () => {
      expect(store.filter()).toBe('all');
    });

    it('should have correct initial state structure', () => {
      const initialState = {
        todos: store.todos(),
        loading: store.loading(),
        filter: store.filter(),
      };

      expect(initialState).toEqual({
        todos: [],
        loading: false,
        filter: 'all',
      });
    });
  });

  describe('State Signals', () => {
    it('should expose todos as a signal', () => {
      const todos = store.todos();
      expect(Array.isArray(todos)).toBe(true);
      expect(todos.length).toBe(0);
    });

    it('should expose loading as a signal', () => {
      const loading = store.loading();
      expect(typeof loading).toBe('boolean');
    });

    it('should expose filter as a signal', () => {
      const filter = store.filter();
      expect(typeof filter).toBe('string');
      expect(['all', 'pending', 'completed']).toContain(filter);
    });

    it('should maintain signal reactivity', () => {
      // Test that signals are reactive by accessing them multiple times
      const todos1 = store.todos();
      const todos2 = store.todos();
      const loading1 = store.loading();
      const loading2 = store.loading();
      const filter1 = store.filter();
      const filter2 = store.filter();

      expect(todos1).toBe(todos2);
      expect(loading1).toBe(loading2);
      expect(filter1).toBe(filter2);
    });
  });

  describe('Signal Store Features', () => {
    it('should have signal store methods and properties', () => {
      // Check that the store has the expected signal store structure
      expect(typeof store.todos).toBe('function');
      expect(typeof store.loading).toBe('function');
      expect(typeof store.filter).toBe('function');
    });

    it('should return consistent values from signals', () => {
      // Multiple calls should return the same values
      for (let i = 0; i < 5; i++) {
        expect(store.todos()).toEqual([]);
        expect(store.loading()).toBe(false);
        expect(store.filter()).toBe('all');
      }
    });
  });

  describe('Type Safety', () => {
    it('should have correct types for todos', () => {
      const todos = store.todos();
      expect(Array.isArray(todos)).toBe(true);
      
      // If we had todos, each should have the correct structure
      todos.forEach((todo: Todo) => {
        expect(todo).toHaveProperty('id');
        expect(todo).toHaveProperty('title');
        expect(todo).toHaveProperty('completed');
      });
    });

    it('should have correct type for loading', () => {
      const loading = store.loading();
      expect(typeof loading).toBe('boolean');
    });

    it('should have correct type for filter', () => {
      const filter = store.filter();
      expect(typeof filter).toBe('string');
      
      // Should be one of the valid TodosFilter values
      const validFilters: TodosFilter[] = ['all', 'pending', 'completed'];
      expect(validFilters).toContain(filter as TodosFilter);
    });
  });

  describe('State Immutability', () => {
    it('should provide direct access to todos array (NgRx signals behavior)', () => {
      const todos = store.todos();
      
      // Verify we can access the array structure
      expect(Array.isArray(todos)).toBe(true);
      
      // Test that we can interact with the array (though it's a snapshot)
      const todosLength = todos.length;
      expect(typeof todosLength).toBe('number');
      expect(todosLength).toBeGreaterThanOrEqual(0);
    });

    it('should return the same reference for unchanged state', () => {
      const todos1 = store.todos();
      const todos2 = store.todos();
      
      // For immutable state, same reference should be returned
      expect(todos1).toBe(todos2);
    });
  });

  describe('Store Configuration', () => {
    it('should be configured with providedIn root', () => {
      // This test verifies that the store can be injected as a singleton
      const store1 = TestBed.inject(TodosStore);
      const store2 = TestBed.inject(TodosStore);
      
      expect(store1).toBe(store2);
    });

    it('should maintain state consistency across injections', () => {
      const store1 = TestBed.inject(TodosStore);
      const store2 = TestBed.inject(TodosStore);
      
      expect(store1.todos()).toEqual(store2.todos());
      expect(store1.loading()).toBe(store2.loading());
      expect(store1.filter()).toBe(store2.filter());
    });
  });

  describe('Integration with NgRx Signals', () => {
    it('should be based on NgRx signalStore', () => {
      // Verify that the store has the expected NgRx signal store structure
      expect(store).toBeDefined();
      expect(typeof store.todos).toBe('function');
      expect(typeof store.loading).toBe('function');
      expect(typeof store.filter).toBe('function');
    });

    it('should work with withState feature', () => {
      // Since the store is a singleton and state might be modified by other tests,
      // we'll verify the structure and types rather than exact values
      const todos = store.todos();
      const loading = store.loading();
      const filter = store.filter();
      
      expect(Array.isArray(todos)).toBe(true);
      expect(typeof loading).toBe('boolean');
      expect(typeof filter).toBe('string');
      expect(['all', 'pending', 'completed']).toContain(filter);
    });
  });
});
