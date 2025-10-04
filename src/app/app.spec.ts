import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';
import { TodosStore } from 'store';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let todosStoreMock: {
    loadAll: jest.Mock;
    loading: jest.Mock;
    filter: jest.Mock;
    todos: jest.Mock;
    filteredTodos: jest.Mock;
    add: jest.Mock;
    deleteTodo: jest.Mock;
    updateTodo: jest.Mock;
    updateFilter: jest.Mock;
  };

  beforeEach(async () => {
    todosStoreMock = {
      loadAll: jest.fn().mockResolvedValue(undefined),
      loading: jest.fn().mockReturnValue(false),
      filter: jest.fn().mockReturnValue('all'),
      todos: jest.fn().mockReturnValue([]),
      filteredTodos: jest.fn().mockReturnValue([]),
      add: jest.fn().mockResolvedValue(undefined),
      deleteTodo: jest.fn().mockResolvedValue(undefined),
      updateTodo: jest.fn().mockResolvedValue(undefined),
      updateFilter: jest.fn().mockReturnValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: TodosStore,
          useValue: todosStoreMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture?.destroy();
    TestBed.resetTestingModule();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(todosStoreMock.loadAll).toHaveBeenCalled();
  });
});
