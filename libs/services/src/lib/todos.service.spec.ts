import { TestBed } from '@angular/core/testing';
import { TodosService } from './todos.service';
import { TODOS } from 'shared';
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
    it('should return an observable of todos', (done) => {
      service.getTodos().subscribe(todos => {
        expect(todos).toBeTruthy();
        expect(Array.isArray(todos)).toBe(true);
        done();
      });
    });

    it('should return todos that match the mock data structure', (done) => {
      service.getTodos().subscribe(todos => {
        todos.forEach(todo => {
          expect(todo).toHaveProperty('id');
          expect(todo).toHaveProperty('title');
          expect(todo).toHaveProperty('completed');
          expect(typeof todo.id).toBe('string');
          expect(typeof todo.title).toBe('string');
          expect(typeof todo.completed).toBe('boolean');
        });
        done();
      });
    });

    it('should return the same todos as in TODOS mock data', (done) => {
      service.getTodos().subscribe(todos => {
        expect(todos.length).toBe(TODOS.length);
        expect(todos).toEqual(TODOS);
        done();
      });
    });

    it('should return a copy of the todos array (not the original reference)', (done) => {
      const originalTodos = (service as unknown as { todos: typeof TODOS }).todos; // Access private property for testing
      
      service.getTodos().subscribe(todos => {
        expect(todos).not.toBe(originalTodos);
        expect(todos).toEqual(originalTodos);
        done();
      });
    });

    it('should emit todos after a delay', async () => {
      const startTime = Date.now();
      
      const todos = await firstValueFrom(service.getTodos());
      
      const endTime = Date.now();
      const timeDifference = endTime - startTime;
      
      expect(todos).toBeTruthy();
      expect(timeDifference).toBeGreaterThan(400); // Should be at least close to 500ms
    });

    it('should return todos with expected initial values', (done) => {
      service.getTodos().subscribe(todos => {
        const expectedTodos = [
          { id: '1', title: 'Learn Angular', completed: false },
          { id: '2', title: 'Learn NgRx', completed: false },
          { id: '3', title: 'Build an app', completed: false },
          { id: '4', title: 'Learn Git', completed: false },
          { id: '5', title: 'Deploy the app', completed: false },
          { id: '6', title: 'Manage server', completed: false },
          { id: '7', title: 'Learn Signal Store', completed: false },
          { id: '8', title: 'Host a presentation', completed: false },
        ];
        
        expect(todos).toEqual(expectedTodos);
        done();
      });
    });

    it('should handle multiple subscriptions correctly', (done) => {
      let completedSubscriptions = 0;
      const expectedSubscriptions = 3;
      
      for (let i = 0; i < expectedSubscriptions; i++) {
        service.getTodos().subscribe(todos => {
          expect(todos).toBeTruthy();
          expect(todos.length).toBe(TODOS.length);
          
          completedSubscriptions++;
          if (completedSubscriptions === expectedSubscriptions) {
            done();
          }
        });
      }
    });

    it('should maintain todos data integrity across multiple calls', async () => {
      const firstCall = await firstValueFrom(service.getTodos());
      const secondCall = await firstValueFrom(service.getTodos());
      
      expect(firstCall).toEqual(secondCall);
      expect(firstCall).toEqual(TODOS);
    });
  });

  describe('service initialization', () => {
    it('should initialize with TODOS data', () => {
      const privateTodos = (service as unknown as { todos: typeof TODOS }).todos;
      expect(privateTodos).toEqual(TODOS);
    });

    it('should be provided in root', () => {
      // This test verifies the service is properly injectable
      const injectedService = TestBed.inject(TodosService);
      expect(injectedService).toBe(service);
    });
  });
});