// tslint:disable:object-literal-sort-keys
import { AvroSchemaRegistryClient } from '.'
import { ISchemaRegistryHttpClient } from '../schema-registry-http-client';
import { expect, jest } from '@jest/globals';

describe('AvroSchemaRegistryClient', () => {
  const schema = {
    "name": "SerializationTest",
    "namespace": "com.example",
    "type": "record",
    "fields": [
      { "name": "first", "type": ["null", "string"] },
      { "name": "last", "type": "string" },
      { "name": "age", "type": ["null", "int"] },
    ]
  };

  interface IData { first?: null | string; last: string, age?: null | number };

  const client: Partial<ISchemaRegistryHttpClient> = {
    createSchema: jest.fn((subjectName: string, schemaContent: unknown) => Promise.resolve({
      id: 200,
      schema: JSON.stringify(schemaContent),
      subject: subjectName as string,
      version: 3,
    })),
    getLatestSchemaInfoBySubject: jest.fn((subjectName: string) => Promise.resolve({
      id: 28,
      schema: JSON.stringify(schema),
      subject: subjectName,
      version: 1,
    })),
    getSchemaById: jest.fn((schemaId) => Promise.resolve({
      schema: JSON.stringify(schema)
    }))
  };

  it('should encode a javascript object given a subject', async () => {
    const data: IData = {
      age: 25,
      first: 'firstName',
      last: 'lastName'
    }

    const avroClient = new AvroSchemaRegistryClient(client as ISchemaRegistryHttpClient);
    const buffer = await avroClient.encodeBySubject(data, 'dataSchema');
    expect(buffer).not.toBe(null);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.readUInt32BE(1)).toBe(28);
  })

  it('should encode a javascript object given an id', async () => {
    const data: IData = {
      age: 25,
      first: 'firstName',
      last: 'lastName'
    }

    const avroClient = new AvroSchemaRegistryClient(client as ISchemaRegistryHttpClient);
    const buffer = await avroClient.encodeById(data, 10);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.readUInt32BE(1)).toBe(10);
  })

  it('should proxy a request to the http client to create a schema', async () => {
    const avroClient = new AvroSchemaRegistryClient(client as ISchemaRegistryHttpClient);
    const result = await avroClient.createSchema('dataSchema', schema);

    expect(result).toBe(200);
  })

  it('should decode an avro buffer into a javascript object', async () => {

    const buffer = Buffer.from([0, 0, 0, 0, 1, 2, 10, 102, 105, 114, 115, 116, 8, 108, 97, 115, 116, 2, 20]);
    const avroClient = new AvroSchemaRegistryClient(client as ISchemaRegistryHttpClient);
    const result = await avroClient.decode<IData>(buffer);

    expect(result.last).toEqual('last');
    expect(result.first).toEqual('first');
    expect(result.age).toEqual(10);
  })
})
