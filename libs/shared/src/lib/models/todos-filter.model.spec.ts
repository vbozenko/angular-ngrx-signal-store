import { TodosFilter } from './todos-filter.model';

describe('TodosFilter', () => {
  describe('Type Definition', () => {
    it('should accept "all" as a valid filter value', () => {
      const filter: TodosFilter = 'all';
      expect(filter).toBe('all');
      expect(typeof filter).toBe('string');
    });

    it('should accept "pending" as a valid filter value', () => {
      const filter: TodosFilter = 'pending';
      expect(filter).toBe('pending');
      expect(typeof filter).toBe('string');
    });

    it('should accept "completed" as a valid filter value', () => {
      const filter: TodosFilter = 'completed';
      expect(filter).toBe('completed');
      expect(typeof filter).toBe('string');
    });

    it('should work with array of filter values', () => {
      const filters: TodosFilter[] = ['all', 'pending', 'completed'];

      expect(filters).toHaveLength(3);
      expect(filters).toContain('all');
      expect(filters).toContain('pending');
      expect(filters).toContain('completed');
    });
  });

  describe('Type Guards and Validation', () => {
    const isValidTodosFilter = (value: string): value is TodosFilter =>
      ['all', 'pending', 'completed'].includes(value);

    it('should validate correct filter values using type guard', () => {
      expect(isValidTodosFilter('all')).toBe(true);
      expect(isValidTodosFilter('pending')).toBe(true);
      expect(isValidTodosFilter('completed')).toBe(true);
    });

    it('should reject invalid filter values using type guard', () => {
      expect(isValidTodosFilter('invalid')).toBe(false);
      expect(isValidTodosFilter('PENDING')).toBe(false); // case sensitive
      expect(isValidTodosFilter('')).toBe(false);
      expect(isValidTodosFilter('ALL')).toBe(false); // case sensitive
    });

    it('should work with switch statements', () => {
      const getFilterDescription = (filter: TodosFilter): string => {
        switch (filter) {
          case 'all':
            return 'Show all todos';
          case 'pending':
            return 'Show pending todos only';
          case 'completed':
            return 'Show completed todos only';
        }
      };

      expect(getFilterDescription('all')).toBe('Show all todos');
      expect(getFilterDescription('pending')).toBe('Show pending todos only');
      expect(getFilterDescription('completed')).toBe('Show completed todos only');
    });
  });

  describe('Usage Patterns', () => {
    it('should work with conditional logic', () => {
      const filters: TodosFilter[] = ['all', 'pending', 'completed'];

      filters.forEach((filter) => {
        if (filter === 'all') {
          expect(filter).toBe('all');
        } else if (filter === 'pending') {
          expect(filter).toBe('pending');
        } else if (filter === 'completed') {
          expect(filter).toBe('completed');
        }
      });
    });

    it('should work with filter functions', () => {
      type MockTodo = { id: string; completed: boolean };
      const todos: MockTodo[] = [
        { id: '1', completed: false },
        { id: '2', completed: true },
        { id: '3', completed: false },
      ];

      const filterTodos = (todos: MockTodo[], filter: TodosFilter): MockTodo[] => {
        switch (filter) {
          case 'all':
            return todos;
          case 'pending':
            return todos.filter((todo) => !todo.completed);
          case 'completed':
            return todos.filter((todo) => todo.completed);
        }
      };

      expect(filterTodos(todos, 'all')).toHaveLength(3);
      expect(filterTodos(todos, 'pending')).toHaveLength(2);
      expect(filterTodos(todos, 'completed')).toHaveLength(1);
    });

    it('should work with object properties', () => {
      type FilterState = {
        currentFilter: TodosFilter;
        availableFilters: TodosFilter[];
      };

      const state: FilterState = {
        currentFilter: 'pending',
        availableFilters: ['all', 'pending', 'completed'],
      };

      expect(state.currentFilter).toBe('pending');
      expect(state.availableFilters).toEqual(['all', 'pending', 'completed']);
      expect(state.availableFilters).toContain(state.currentFilter);
    });

    it('should work with default parameter values', () => {
      const createFilter = (filter: TodosFilter = 'all'): TodosFilter => filter;

      expect(createFilter()).toBe('all');
      expect(createFilter('pending')).toBe('pending');
      expect(createFilter('completed')).toBe('completed');
    });
  });

  describe('Enum-like Behavior', () => {
    const TODOS_FILTERS = {
      ALL: 'all' as const,
      pending: 'pending' as const,
      COMPLETED: 'completed' as const,
    } satisfies Record<string, TodosFilter>;

    it('should work with constant object for enum-like behavior', () => {
      expect(TODOS_FILTERS.ALL).toBe('all');
      expect(TODOS_FILTERS.pending).toBe('pending');
      expect(TODOS_FILTERS.COMPLETED).toBe('completed');
    });

    it('should get all filter values from constant object', () => {
      const allFilters = Object.values(TODOS_FILTERS);

      expect(allFilters).toHaveLength(3);
      expect(allFilters).toEqual(['all', 'pending', 'completed']);
    });

    it('should work with Object.keys for filter enumeration', () => {
      const filterKeys = Object.keys(TODOS_FILTERS);

      expect(filterKeys).toEqual(['ALL', 'pending', 'COMPLETED']);
    });
  });

  describe('Edge Cases and Type Safety', () => {
    it('should maintain type safety with union types', () => {
      type ExtendedFilter = TodosFilter | 'archived';

      const isBasicFilter = (filter: ExtendedFilter): filter is TodosFilter =>
        ['all', 'pending', 'completed'].includes(filter);

      const extendedFilter: ExtendedFilter = 'archived';
      expect(isBasicFilter(extendedFilter)).toBe(false);

      const basicFilter: ExtendedFilter = 'all';
      expect(isBasicFilter(basicFilter)).toBe(true);
    });

    it('should work with readonly arrays', () => {
      const readonlyFilters: readonly TodosFilter[] = ['all', 'pending', 'completed'] as const;

      expect(readonlyFilters).toHaveLength(3);
      expect([...readonlyFilters]).toEqual(['all', 'pending', 'completed']);
    });

    it('should work with Set operations', () => {
      const filterSet = new Set<TodosFilter>(['all', 'pending', 'completed']);

      expect(filterSet.size).toBe(3);
      expect(filterSet.has('all')).toBe(true);
      expect(filterSet.has('pending')).toBe(true);
      expect(filterSet.has('completed')).toBe(true);

      // Test uniqueness
      filterSet.add('all'); // duplicate
      expect(filterSet.size).toBe(3);
    });

    it('should work with Map operations', () => {
      const filterDescriptions = new Map<TodosFilter, string>([
        ['all', 'All items'],
        ['pending', 'pending items only'],
        ['completed', 'Completed items only'],
      ]);

      expect(filterDescriptions.size).toBe(3);
      expect(filterDescriptions.get('all')).toBe('All items');
      expect(filterDescriptions.get('pending')).toBe('pending items only');
      expect(filterDescriptions.get('completed')).toBe('Completed items only');
    });
  });
});
