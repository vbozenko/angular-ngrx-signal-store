const { setupZonelessTestEnv } = require('jest-preset-angular/setup-env/zoneless');

// Initialize the Angular testing environment for zoneless change detection
setupZonelessTestEnv();

// Mock for matchMedia (commonly needed for Angular Material components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock for ResizeObserver (sometimes needed for Angular Material)
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));