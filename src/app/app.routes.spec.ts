import { routes } from './app.routes';

describe('App Routes', () => {
  it('should be defined', () => {
    expect(routes).toBeDefined();
  });

  it('should be an array', () => {
    expect(Array.isArray(routes)).toBe(true);
  });

  it('should be empty initially', () => {
    expect(routes.length).toBe(0);
  });

  it('should export valid Routes configuration', () => {
    expect(routes).toEqual([]);
  });
});
