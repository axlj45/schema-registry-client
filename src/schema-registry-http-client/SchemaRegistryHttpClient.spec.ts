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

  it('should retrieve versions for a subject', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn(() => Promise.resolve({ data: [1, 2] }))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.getSubjectVersions('subjectName');

    expect(result).toEqual([1, 2]);
    expect(client.get).toBeCalledTimes(1);
    expect(client.get).toBeCalledWith('/subjects/subjectName/versions')
  })

  it('should delete a subject', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      delete: jest.fn(() => Promise.resolve({ data: [1, 2] }))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.deleteSubject('subjectName');

    expect(result).toEqual([1, 2]);
    expect(client.delete).toBeCalledTimes(1);
    expect(client.delete).toBeCalledWith('/subjects/subjectName')
  })

  it('should delete a schema by subject version', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      delete: jest.fn(() => Promise.resolve({ data: [1, 2] }))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.deleteSchemaBySubjectVersion('subjectName', 3);

    expect(result).toEqual([1, 2]);
    expect(client.delete).toBeCalledTimes(1);
    expect(client.delete).toBeCalledWith('/subjects/subjectName/versions/3')
  })

  it('should retrieve schema information by subject version', async () => {
    const expectedResult: ISchemaResult = {
      id: 10,
      schema: "{}",
      subject: 'subjectName',
      version: 3
    }
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn(() => Promise.resolve({ data: expectedResult }))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.getSchemaInfoBySubjectVersion('subjectName', 20);

    expect(result).toEqual(expectedResult);
    expect(client.get).toBeCalledTimes(1);
    expect(client.get).toBeCalledWith('/subjects/subjectName/versions/20')
  })

  it('should retrieve latest schema information by subject', async () => {
    const expectedResult: ISchemaResult = {
      id: 10,
      schema: "{}",
      subject: 'subjectName',
      version: 3
    }
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn(() => Promise.resolve({ data: expectedResult }))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.getLatestSchemaInfoBySubject('subjectName');

    expect(result).toEqual(expectedResult);
    expect(client.get).toBeCalledTimes(1);
    expect(client.get).toBeCalledWith('/subjects/subjectName/versions/latest')
  })

  it('should retrieve schema only by subject version', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn(() => Promise.resolve({ data: { schema: { key: 'schemaData' } } }))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.getSchemaBySubjectVersion('subjectName', 5);

    expect(result).toEqual({ schema: { key: 'schemaData' } });
    expect(client.get).toBeCalledTimes(1);
    expect(client.get).toBeCalledWith('/subjects/subjectName/versions/5/schema')
  })

  it('should retrieve latest schema only by subject version', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn(() => Promise.resolve({ data: { schema: { key: 'schemaData' } } }))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.getLatestSchemaBySubject('subjectName');

    expect(result).toEqual({ schema: { key: 'schemaData' } });
    expect(client.get).toBeCalledTimes(1);
    expect(client.get).toBeCalledWith('/subjects/subjectName/versions/latest/schema')
  })
});
