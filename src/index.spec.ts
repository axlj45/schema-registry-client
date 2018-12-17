import { SchemaRegistryClient } from '.'

describe('Public API', () => {
  it('should expose SchemaRegistryClient', () => {
    expect(SchemaRegistryClient).toBeTruthy();
  })
});
