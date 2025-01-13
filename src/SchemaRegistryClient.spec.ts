import { SchemaRegistryClient } from '.';
import { AvroSchemaRegistryClient } from './schema-registry-client';
import { expect } from '@jest/globals';

describe('SchemaRegistryClient', () => {
  it('should create a new instance', () => {
    expect(SchemaRegistryClient.Instance).toBeUndefined();

    SchemaRegistryClient.create('http://localhost:80801');

    expect(SchemaRegistryClient.Instance).toBeInstanceOf(AvroSchemaRegistryClient)
  })

  it('should create a new non-caching instance', () => {
    SchemaRegistryClient.create('http://localhost:80801', false);

    expect(SchemaRegistryClient.Instance).toBeInstanceOf(AvroSchemaRegistryClient)
  })
});
