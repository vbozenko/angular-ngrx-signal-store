import { Todo } from './todo.model';

describe('Todo Model', () => {
  it('should create a todo with all required properties', () => {
    const todo: Todo = {
      id: '1',
      title: 'Test Todo',
      completed: false
    };

    expect(todo).toBeDefined();
    expect(todo.id).toBe('1');
    expect(todo.title).toBe('Test Todo');
    expect(todo.completed).toBe(false);
  });

  it('should have correct property types', () => {
    const todo: Todo = {
      id: '123',
      title: 'Learn Jest',
      completed: true
    };

    expect(typeof todo.id).toBe('string');
    expect(typeof todo.title).toBe('string');
    expect(typeof todo.completed).toBe('boolean');
  });

  it('should work with Jest matchers', () => {
    const todos: Todo[] = [
      { id: '1', title: 'First Todo', completed: false },
      { id: '2', title: 'Second Todo', completed: true },
    ];

    // Array matchers
    expect(todos).toHaveLength(2);
    expect(todos).toContainEqual({ id: '1', title: 'First Todo', completed: false });
    
    // String matchers
    expect(todos[0].title).toContain('First');
    expect(todos[1].title).toMatch(/Second/);
    
    // Object matchers
    expect(todos[0]).toMatchObject({ id: '1', completed: false });
  });
});