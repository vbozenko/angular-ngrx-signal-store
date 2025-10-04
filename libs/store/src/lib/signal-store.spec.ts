import { TestBed } from '@angular/core/testing';
import { TodosStore } from './signal-store';
import { Todo } from 'shared';
import { TodosService } from 'services';
import { of } from 'rxjs';

// Mock TodosService
const mockTodosService = {
  getTodos: jest.fn(),
  addTodo: jest.fn(),
  deleteTodo: jest.fn(),
  updateTodo: jest.fn(),
};

describe('TodosStore', () => {
  let store: InstanceType<typeof TodosStore>;
  let todosService: jest.Mocked<TodosService>;

  // Mock data for testing
  const mockTodos: Todo[] = [
    { id: '1', title: 'Learn Angular', completed: false },
    { id: '2', title: 'Build Todo App', completed: true },
    { id: '3', title: 'Write Tests', completed: false },
  ];

  const newTodo: Todo = { id: '4', title: 'New Todo', completed: false };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TodosService, useValue: mockTodosService }],
    });

    store = TestBed.inject(TodosStore);
    todosService = TestBed.inject(TodosService) as jest.Mocked<TodosService>;

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('Store Creation and Initial State', () => {
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

    it('should have correct initial state', () => {
      expect(store.todos()).toEqual([]);
      expect(store.loading()).toBe(false);
      expect(store.filter()).toBe('all');
    });

    it('should have initial filteredTodos computed signal', () => {
      expect(store.filteredTodos()).toEqual([]);
    });
  });

  describe('State Properties', () => {
    beforeEach(() => {
      // Set up some todos for testing state properties
      todosService.getTodos.mockReturnValue(of(mockTodos));
    });

    it('should expose todos signal', async () => {
      await store.loadAll();
      expect(store.todos()).toEqual(mockTodos);
    });

    it('should expose loading signal', async () => {
      const todosPromise = store.loadAll();
      expect(store.loading()).toBe(true);
      await todosPromise;
      expect(store.loading()).toBe(false);
    });

    it('should expose filter signal', () => {
      expect(store.filter()).toBe('all');
      store.updateFilter('pending');
      expect(store.filter()).toBe('pending');
    });

    it('should expose filteredTodos computed signal', async () => {
      await store.loadAll();
      expect(store.filteredTodos()).toEqual(mockTodos);
    });
  });

  describe('loadAll() method', () => {
    it('should load todos successfully', async () => {
      todosService.getTodos.mockReturnValue(of(mockTodos));

      await store.loadAll();

      expect(todosService.getTodos).toHaveBeenCalledTimes(1);
      expect(store.todos()).toEqual(mockTodos);
      expect(store.loading()).toBe(false);
    });

    it('should set loading to true during loading and false after completion', async () => {
      todosService.getTodos.mockReturnValue(of(mockTodos));

      const loadAllPromise = store.loadAll();
      expect(store.loading()).toBe(true);

      await loadAllPromise;
      expect(store.loading()).toBe(false);
    });

    it('should handle empty todos response', async () => {
      todosService.getTodos.mockReturnValue(of([]));

      await store.loadAll();

      expect(store.todos()).toEqual([]);
      expect(store.loading()).toBe(false);
    });

    it('should call service and update state with returned todos', async () => {
      const customTodos = [{ id: '99', title: 'Custom Todo', completed: true }];
      todosService.getTodos.mockReturnValue(of(customTodos));

      await store.loadAll();

      expect(todosService.getTodos).toHaveBeenCalledWith();
      expect(store.todos()).toEqual(customTodos);
    });
  });

  describe('add() method', () => {
    beforeEach(() => {
      // Pre-populate with existing todos
      todosService.getTodos.mockReturnValue(of(mockTodos));
    });

    it('should add a new todo successfully', async () => {
      await store.loadAll(); // Set up initial todos
      todosService.addTodo.mockReturnValue(of(newTodo));

      await store.add('New Todo');

      expect(todosService.addTodo).toHaveBeenCalledWith({ title: 'New Todo', completed: false });
      expect(store.todos()).toContain(newTodo);
      expect(store.todos()).toHaveLength(mockTodos.length + 1);
    });

    it('should add todo to existing list', async () => {
      await store.loadAll();
      todosService.addTodo.mockReturnValue(of(newTodo));
      const initialTodos = store.todos();

      await store.add('New Todo');

      expect(store.todos()).toEqual([...initialTodos, newTodo]);
    });

    it('should call service with correct parameters', async () => {
      todosService.addTodo.mockReturnValue(of(newTodo));
      const title = 'Test Todo Title';

      await store.add(title);

      expect(todosService.addTodo).toHaveBeenCalledWith({
        title,
        completed: false,
      });
    });

    it('should work with empty initial state', async () => {
      todosService.addTodo.mockReturnValue(of(newTodo));

      await store.add('First Todo');

      expect(store.todos()).toEqual([newTodo]);
    });

    it('should preserve existing todos when adding new one', async () => {
      await store.loadAll();
      todosService.addTodo.mockReturnValue(of(newTodo));
      const existingTodos = [...store.todos()];

      await store.add('New Todo');

      const updatedTodos = store.todos();
      expect(updatedTodos.slice(0, -1)).toEqual(existingTodos);
      expect(updatedTodos[updatedTodos.length - 1]).toEqual(newTodo);
    });
  });

  describe('deleteTodo() method', () => {
    beforeEach(async () => {
      // Pre-populate with existing todos
      todosService.getTodos.mockReturnValue(of(mockTodos));
      await store.loadAll();
    });

    it('should delete todo successfully', async () => {
      todosService.deleteTodo.mockReturnValue(of(void 0));
      const todoIdToDelete = '1';

      await store.deleteTodo(todoIdToDelete);

      expect(todosService.deleteTodo).toHaveBeenCalledWith(todoIdToDelete);
      expect(store.todos()).not.toContain(mockTodos.find((t) => t.id === todoIdToDelete));
      expect(store.todos()).toHaveLength(mockTodos.length - 1);
    });

    it('should remove correct todo by id', async () => {
      todosService.deleteTodo.mockReturnValue(of(void 0));
      const todoIdToDelete = '2';
      const expectedTodos = mockTodos.filter((t) => t.id !== todoIdToDelete);

      await store.deleteTodo(todoIdToDelete);

      expect(store.todos()).toEqual(expectedTodos);
    });

    it('should handle deletion of non-existent todo', async () => {
      todosService.deleteTodo.mockReturnValue(of(void 0));
      const nonExistentId = 'non-existent';
      const originalTodos = [...store.todos()];

      await store.deleteTodo(nonExistentId);

      expect(todosService.deleteTodo).toHaveBeenCalledWith(nonExistentId);
      expect(store.todos()).toEqual(originalTodos);
    });

    it('should call service with correct id', async () => {
      todosService.deleteTodo.mockReturnValue(of(void 0));
      const todoId = '3';

      await store.deleteTodo(todoId);

      expect(todosService.deleteTodo).toHaveBeenCalledWith(todoId);
      expect(todosService.deleteTodo).toHaveBeenCalledTimes(1);
    });

    it('should preserve other todos when deleting one', async () => {
      todosService.deleteTodo.mockReturnValue(of(void 0));
      const todoIdToDelete = '1';
      const todosToKeep = mockTodos.filter((t) => t.id !== todoIdToDelete);

      await store.deleteTodo(todoIdToDelete);

      expect(store.todos()).toEqual(todosToKeep);
      todosToKeep.forEach((todo) => {
        expect(store.todos()).toContain(todo);
      });
    });
  });

  describe('updateTodo() method', () => {
    beforeEach(async () => {
      // Pre-populate with existing todos
      todosService.getTodos.mockReturnValue(of(mockTodos));
      await store.loadAll();
    });

    it('should update todo completion status successfully', async () => {
      todosService.updateTodo.mockReturnValue(of(void 0));
      const todoId = '1';
      const newCompletedStatus = true;

      await store.updateTodo(todoId, newCompletedStatus);

      expect(todosService.updateTodo).toHaveBeenCalledWith(todoId, newCompletedStatus);
      const updatedTodo = store.todos().find((t) => t.id === todoId);
      expect(updatedTodo?.completed).toBe(newCompletedStatus);
    });

    it('should update from false to true', async () => {
      todosService.updateTodo.mockReturnValue(of(void 0));
      const todoId = '1'; // This todo has completed: false

      await store.updateTodo(todoId, true);

      const updatedTodo = store.todos().find((t) => t.id === todoId);
      expect(updatedTodo?.completed).toBe(true);
    });

    it('should update from true to false', async () => {
      todosService.updateTodo.mockReturnValue(of(void 0));
      const todoId = '2'; // This todo has completed: true

      await store.updateTodo(todoId, false);

      const updatedTodo = store.todos().find((t) => t.id === todoId);
      expect(updatedTodo?.completed).toBe(false);
    });

    it('should preserve other todo properties when updating', async () => {
      todosService.updateTodo.mockReturnValue(of(void 0));
      const todoId = '1';
      const originalTodo = store.todos().find((t) => t.id === todoId);
      expect(originalTodo).toBeDefined();

      await store.updateTodo(todoId, true);

      const updatedTodo = store.todos().find((t) => t.id === todoId);
      expect(updatedTodo).toBeDefined();
      expect(updatedTodo?.id).toBe(originalTodo?.id);
      expect(updatedTodo?.title).toBe(originalTodo?.title);
      expect(updatedTodo?.completed).toBe(true);
    });

    it('should not affect other todos when updating one', async () => {
      todosService.updateTodo.mockReturnValue(of(void 0));
      const todoId = '1';
      const otherTodos = store.todos().filter((t) => t.id !== todoId);

      await store.updateTodo(todoId, true);

      otherTodos.forEach((originalTodo) => {
        const currentTodo = store.todos().find((t) => t.id === originalTodo.id);
        expect(currentTodo).toEqual(originalTodo);
      });
    });

    it('should handle update of non-existent todo', async () => {
      todosService.updateTodo.mockReturnValue(of(void 0));
      const nonExistentId = 'non-existent';
      const originalTodos = [...store.todos()];

      await store.updateTodo(nonExistentId, true);

      expect(todosService.updateTodo).toHaveBeenCalledWith(nonExistentId, true);
      expect(store.todos()).toEqual(originalTodos);
    });

    it('should call service with correct parameters', async () => {
      todosService.updateTodo.mockReturnValue(of(void 0));
      const todoId = '3';
      const completed = true;

      await store.updateTodo(todoId, completed);

      expect(todosService.updateTodo).toHaveBeenCalledWith(todoId, completed);
      expect(todosService.updateTodo).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateFilter() method', () => {
    it('should update filter to "pending"', () => {
      store.updateFilter('pending');
      expect(store.filter()).toBe('pending');
    });

    it('should update filter to "completed"', () => {
      store.updateFilter('completed');
      expect(store.filter()).toBe('completed');
    });

    it('should update filter to "all"', () => {
      store.updateFilter('all');
      expect(store.filter()).toBe('all');
    });

    it('should change filter from one value to another', () => {
      store.updateFilter('pending');
      expect(store.filter()).toBe('pending');

      store.updateFilter('completed');
      expect(store.filter()).toBe('completed');

      store.updateFilter('all');
      expect(store.filter()).toBe('all');
    });

    it('should not be async and should update immediately', () => {
      const result = store.updateFilter('pending');
      expect(result).toBeUndefined(); // No return value
      expect(store.filter()).toBe('pending'); // Immediate update
    });
  });

  describe('filteredTodos computed signal', () => {
    beforeEach(async () => {
      todosService.getTodos.mockReturnValue(of(mockTodos));
      await store.loadAll();
    });

    it('should return all todos when filter is "all"', () => {
      store.updateFilter('all');
      expect(store.filteredTodos()).toEqual(mockTodos);
    });

    it('should return only pending todos when filter is "pending"', () => {
      store.updateFilter('pending');
      const pendingTodos = mockTodos.filter((t) => !t.completed);
      expect(store.filteredTodos()).toEqual(pendingTodos);
    });

    it('should return only completed todos when filter is "completed"', () => {
      store.updateFilter('completed');
      const completedTodos = mockTodos.filter((t) => t.completed);
      expect(store.filteredTodos()).toEqual(completedTodos);
    });

    it('should update when todos change', async () => {
      store.updateFilter('pending');
      const initialFiltered = store.filteredTodos();

      // Add a new pending todo
      const newPendingTodo: Todo = { id: '5', title: 'New Pending', completed: false };
      todosService.addTodo.mockReturnValue(of(newPendingTodo));
      await store.add('New Pending');

      expect(store.filteredTodos()).toEqual([...initialFiltered, newPendingTodo]);
    });

    it('should update when filter changes', () => {
      store.updateFilter('all');
      const allTodos = store.filteredTodos();

      store.updateFilter('pending');
      const pendingTodos = store.filteredTodos();

      store.updateFilter('completed');
      const completedTodos = store.filteredTodos();

      expect(allTodos).toEqual(mockTodos);
      expect(pendingTodos).toEqual(mockTodos.filter((t) => !t.completed));
      expect(completedTodos).toEqual(mockTodos.filter((t) => t.completed));
    });

    it('should handle empty todos array', async () => {
      // Reset to empty
      todosService.getTodos.mockReturnValue(of([]));
      await store.loadAll();

      store.updateFilter('all');
      expect(store.filteredTodos()).toEqual([]);

      store.updateFilter('pending');
      expect(store.filteredTodos()).toEqual([]);

      store.updateFilter('completed');
      expect(store.filteredTodos()).toEqual([]);
    });

    it('should handle all todos being completed', async () => {
      const allCompletedTodos = mockTodos.map((t) => ({ ...t, completed: true }));
      todosService.getTodos.mockReturnValue(of(allCompletedTodos));
      await store.loadAll();

      store.updateFilter('pending');
      expect(store.filteredTodos()).toEqual([]);

      store.updateFilter('completed');
      expect(store.filteredTodos()).toEqual(allCompletedTodos);
    });

    it('should handle all todos being pending', async () => {
      const allPendingTodos = mockTodos.map((t) => ({ ...t, completed: false }));
      todosService.getTodos.mockReturnValue(of(allPendingTodos));
      await store.loadAll();

      store.updateFilter('completed');
      expect(store.filteredTodos()).toEqual([]);

      store.updateFilter('pending');
      expect(store.filteredTodos()).toEqual(allPendingTodos);
    });

    it('should react to todo completion status changes', async () => {
      store.updateFilter('pending');
      const initialPending = store.filteredTodos();

      // Complete a pending todo
      const pendingTodo = mockTodos.find((t) => !t.completed);
      if (pendingTodo) {
        todosService.updateTodo.mockReturnValue(of(void 0));
        await store.updateTodo(pendingTodo.id, true);

        const updatedPending = store.filteredTodos();
        expect(updatedPending.length).toBe(initialPending.length - 1);
        expect(updatedPending.find((t) => t.id === pendingTodo.id)).toBeUndefined();
      }
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete workflow: load -> add -> update -> delete', async () => {
      // Load initial todos
      todosService.getTodos.mockReturnValue(of(mockTodos));
      await store.loadAll();
      expect(store.todos()).toEqual(mockTodos);

      // Add a new todo
      todosService.addTodo.mockReturnValue(of(newTodo));
      await store.add('New Todo');
      expect(store.todos()).toContain(newTodo);

      // Update the new todo
      todosService.updateTodo.mockReturnValue(of(void 0));
      await store.updateTodo(newTodo.id, true);
      const updatedTodo = store.todos().find((t) => t.id === newTodo.id);
      expect(updatedTodo?.completed).toBe(true);

      // Delete the todo
      todosService.deleteTodo.mockReturnValue(of(void 0));
      await store.deleteTodo(newTodo.id);
      expect(store.todos().find((t) => t.id === newTodo.id)).toBeUndefined();
    });

    it('should maintain filter state during CRUD operations', async () => {
      todosService.getTodos.mockReturnValue(of(mockTodos));
      await store.loadAll();

      store.updateFilter('pending');
      expect(store.filter()).toBe('pending');

      // Add todo - filter should remain
      todosService.addTodo.mockReturnValue(of(newTodo));
      await store.add('New Todo');
      expect(store.filter()).toBe('pending');

      // Update todo - filter should remain
      todosService.updateTodo.mockReturnValue(of(void 0));
      await store.updateTodo('1', true);
      expect(store.filter()).toBe('pending');

      // Delete todo - filter should remain
      todosService.deleteTodo.mockReturnValue(of(void 0));
      await store.deleteTodo('1');
      expect(store.filter()).toBe('pending');
    });

    it('should update filteredTodos correctly during mixed operations', async () => {
      todosService.getTodos.mockReturnValue(of(mockTodos));
      await store.loadAll();

      // Set filter to pending
      store.updateFilter('pending');
      const initialPendingCount = store.filteredTodos().length;

      // Add a new pending todo
      const newPendingTodo = { ...newTodo, completed: false };
      todosService.addTodo.mockReturnValue(of(newPendingTodo));
      await store.add('New Pending Todo');
      expect(store.filteredTodos().length).toBe(initialPendingCount + 1);

      // Complete one pending todo
      const pendingTodo = store.todos().find((t) => !t.completed);
      if (pendingTodo) {
        todosService.updateTodo.mockReturnValue(of(void 0));
        await store.updateTodo(pendingTodo.id, true);
        expect(store.filteredTodos().length).toBe(initialPendingCount); // Back to original count
      }
    });
  });
});
