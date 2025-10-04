import { TestBed } from '@angular/core/testing';
import { TodosService } from './todos.service';
import { Todo, TODOS } from 'shared';
import { firstValueFrom } from 'rxjs';

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTodos', () => {
    it('should return a copy of todos as an observable with delay', async () => {
      const startTime = Date.now();

      const todos = await firstValueFrom(service.getTodos());

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Verify it returns the expected todos
      expect(todos).toEqual(TODOS);
      expect(Array.isArray(todos)).toBe(true);

      // Verify it's a copy, not the same reference
      expect(todos).not.toBe(TODOS);

      // Verify delay is applied (should be at least 500ms)
      expect(duration).toBeGreaterThanOrEqual(450); // Some tolerance for timing
    });
  });

  describe('addTodo', () => {
    it('should create a new todo with generated id and return it as observable', async () => {
      const partialTodo: Partial<Todo> = {
        title: 'Test Todo',
        completed: false,
      };

      const newTodo = await firstValueFrom(service.addTodo(partialTodo));

      expect(newTodo).toBeDefined();
      expect(newTodo.id).toBeDefined();
      expect(typeof newTodo.id).toBe('string');
      expect(newTodo.id.length).toBeGreaterThan(0);
      expect(newTodo.title).toBe('Test Todo');
      expect(newTodo.completed).toBe(false);
    });

    it('should merge partial todo data with generated id', async () => {
      const partialTodo: Partial<Todo> = {
        title: 'Another Test Todo',
      };

      const newTodo = await firstValueFrom(service.addTodo(partialTodo));

      expect(newTodo.title).toBe('Another Test Todo');
      expect(newTodo.id).toBeDefined();
      expect(typeof newTodo.id).toBe('string');
    });

    it('should generate unique ids for different todos', async () => {
      const todo1 = await firstValueFrom(service.addTodo({ title: 'Todo 1' }));
      const todo2 = await firstValueFrom(service.addTodo({ title: 'Todo 2' }));

      expect(todo1.id).not.toBe(todo2.id);
    });

    it('should apply delay to the observable', async () => {
      const startTime = Date.now();

      await firstValueFrom(service.addTodo({ title: 'Test' }));

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeGreaterThanOrEqual(450); // Some tolerance for timing
    });
  });

  describe('deleteTodo', () => {
    it('should return void observable on completion', async () => {
      const result = await firstValueFrom(service.deleteTodo('test-id'));

      expect(result).toBeUndefined();
    });

    it('should apply delay to the observable', async () => {
      const startTime = Date.now();

      await firstValueFrom(service.deleteTodo('test-id'));

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeGreaterThanOrEqual(450); // Some tolerance for timing
    });
  });

  describe('updateTodo', () => {
    it('should return void observable on completion', async () => {
      const result = await firstValueFrom(service.updateTodo('test-id', true));

      expect(result).toBeUndefined();
    });

    it('should apply delay to the observable', async () => {
      const startTime = Date.now();

      await firstValueFrom(service.updateTodo('test-id', true));

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeGreaterThanOrEqual(450); // Some tolerance for timing
    });
  });
});
