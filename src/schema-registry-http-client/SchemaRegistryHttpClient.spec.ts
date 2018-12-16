import { SchemaRegistryHttpClient } from '.';
import { IHttpClient, IHttpResponse } from '../http-client';
import { ISchemaResult } from './models';
import { ISchemaRequest } from './models/ISchemaRequest';

describe('SchemaRegistryHttpClient', () => {
  it('should retrieve schema by id', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn(() => Promise.resolve({ data: { schema: { key: 'schemaData' } } }))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result: ISchemaRequest = await sut.getSchemaById(30);

    expect(result.schema).toEqual({ key: 'schemaData' });
    expect(client.get).toBeCalledTimes(1);
    expect(client.get).toBeCalledWith('/schemas/ids/30')
  })

  it('should verify compatibility', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      post: jest.fn(jest.fn(() => Promise.resolve({ data: { is_compatible: true } })))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.isCompatible('targetSubject', 'targetSubjectVersion', { schema: '{}' });

    expect(result).toBe(true);

    expect(client.post).toBeCalledTimes(1);
    expect(client.post).toBeCalledWith('/compatibility/subjects/targetSubject/versions/targetSubjectVersion', { schema: '{}' })
  })

  it('should verify latest compatibility', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      post: jest.fn(jest.fn(() => Promise.resolve({ data: { is_compatible: true } })))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.isCompatibleAgainstLatest('targetSubject', { schema: '{}' });

    expect(result).toBe(true);
    expect(client.post).toBeCalledTimes(1);
    expect(client.post).toBeCalledWith('/compatibility/subjects/targetSubject/versions/latest', { schema: '{}' })
  })

  it('should retrieve subjects', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn(() => Promise.resolve({ data: ['subject1', 'subject2'] }))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.getSubjects();

    expect(result).toEqual(['subject1', 'subject2']);
    expect(client.get).toBeCalledTimes(1);
    expect(client.get).toBeCalledWith('/subjects')
  })

});
