// tslint:disable:object-literal-sort-keys
import { AvroSerializer } from './';
import { expect } from '@jest/globals';

describe('AvroSerializer', () => {
  const serializer = new AvroSerializer();
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

  it('should serialize a full data object using a schema', () => {
    const data: IData = {
      first: 'firstName',
      last: 'lastName',
      age: 25
    }

    const expectedResult = Buffer.from([2, 18, 102, 105, 114, 115, 116, 78, 97, 109, 101, 16, 108, 97, 115, 116, 78, 97, 109, 101, 2, 50]);

    const result = serializer.serialize(data, JSON.stringify(schema));
    expect(result).toEqual(expectedResult);
  });

  it('should serialize a partial data object using a schema', () => {
    const data: IData = {
      first: null,
      last: 'lastName',
      age: null
    }

    const expectedResult = Buffer.from([0, 16, 108, 97, 115, 116, 78, 97, 109, 101, 0]);

    const result = serializer.serialize(data, JSON.stringify(schema));
    expect(result).toEqual(expectedResult);
  });

  it('should deserialize a full data object using a schema', () => {
    const data: IData = {
      first: 'firstName',
      last: 'lastName',
      age: 25
    }

    const buffer = Buffer.from([2, 18, 102, 105, 114, 115, 116, 78, 97, 109, 101, 16, 108, 97, 115, 116, 78, 97, 109, 101, 2, 50]);

    const result = serializer.deserialize(buffer, JSON.stringify(schema));
    expect(result).toEqual(data);
  });

  it('should deserialize a partial data object using a schema', () => {
    const data: IData = {
      age: null,
      first: null,
      last: 'lastName',
    }

    const buffer = Buffer.from([0, 16, 108, 97, 115, 116, 78, 97, 109, 101, 0]);

    const result = serializer.deserialize(buffer, JSON.stringify(schema));
    expect(result).toEqual(data);
  });
});
