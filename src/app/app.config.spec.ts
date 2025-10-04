describe('AppConfig', () => {
  it('should be importable and defined', async () => {
    const { appConfig } = await import('./app.config');
    expect(appConfig).toBeDefined();
    expect(appConfig.providers).toBeDefined();
  });

  it('should have providers array', async () => {
    const { appConfig } = await import('./app.config');
    expect(Array.isArray(appConfig.providers)).toBe(true);
    expect(appConfig.providers.length).toBe(3);
  });

  it('should export valid configuration', async () => {
    const { appConfig } = await import('./app.config');
    expect(typeof appConfig).toBe('object');
    expect(appConfig).toHaveProperty('providers');
  });
});
