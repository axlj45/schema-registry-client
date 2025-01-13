import { SchemaRegistryClient } from '.'
import { expect } from '@jest/globals'

describe('Public API', () => {
  it('should expose SchemaRegistryClient', () => {
    expect(SchemaRegistryClient).toBeTruthy();
  })
});
