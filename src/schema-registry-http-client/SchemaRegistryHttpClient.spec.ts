import { SchemaRegistryHttpClient } from '.';
import { IHttpClient, IHttpResponse } from '../http-client';
import { CompatibilityType, ISchemaResult } from './models';
import { ISchemaRequest } from './models/ISchemaRequest';
import { expect, jest } from '@jest/globals';

describe('SchemaRegistryHttpClient', () => {
  it('should retrieve schema by id', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn(() => Promise.resolve({ data: { schema: { key: 'schemaData' } } } as unknown as IHttpResponse<any>))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result: ISchemaRequest = await sut.getSchemaById(30);

    expect(result.schema).toEqual({ key: 'schemaData' });
    expect(client.get).toBeCalledTimes(1);
    expect(client.get).toBeCalledWith('/schemas/ids/30')
  })

  it('should not retrieve a schema by id when it does not exist', async () => {
    const error = { response: { status: 500, data: { error_code: '500', message: 'test err' } } };
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn(() => Promise.reject(error))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = sut.getSchemaById(30);

    await expect(result).rejects.toEqual({ errorCode: '500', httpStatusCode: 500, message: 'test err' });
    expect(client.get).toBeCalledTimes(1);
  })

  it('should verify compatibility', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      post: jest.fn(() => Promise.resolve({ data: { is_compatible: true } } as unknown as IHttpResponse<any>))
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
      post: jest.fn(() => Promise.resolve({ data: { is_compatible: true }, message: '', statusCode: 200 } as unknown as IHttpResponse<any>))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.isCompatibleAgainstLatest('targetSubject', { schema: '{}' });

    expect(result).toBe(true);
    expect(client.post).toBeCalledTimes(1);
    expect(client.post).toBeCalledWith('/compatibility/subjects/targetSubject/versions/latest', { schema: '{}' })
  })

  it('should not verify latest compatibility when an error occurs', async () => {
    const error = { response: { status: 500, data: { error_code: '500', message: 'test err' } } };
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      post: jest.fn(() => Promise.reject(error))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = sut.isCompatibleAgainstLatest('targetSubject', { schema: '{}' });

    await expect(result).rejects.toEqual({ errorCode: '500', httpStatusCode: 500, message: 'test err' });
    expect(client.post).toBeCalledTimes(1);
  })

  it('should retrieve subjects', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn((resourceUri: string) => Promise.resolve({ data: ['subject1', 'subject2'] } as unknown as IHttpResponse<string[]>)) as jest.MockedFunction<IHttpClient['get']>
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.getSubjects();

    expect(result).toEqual(['subject1', 'subject2']);
    expect(client.get).toBeCalledTimes(1);
    expect(client.get).toBeCalledWith('/subjects')
  })

  it('should not retrieve subjects if an error occurs', async () => {
    const error = { response: { status: 500, data: { error_code: '500', message: 'test err' } } };
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn(() => Promise.reject(error))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = sut.getSubjects();

    await expect(result).rejects.toEqual({ errorCode: '500', httpStatusCode: 500, message: 'test err' });
    expect(client.get).toBeCalledTimes(1);
  })

  it('should retrieve versions for a subject', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn((resourceUri: string) => Promise.resolve({ data: [1, 2] } as unknown as IHttpResponse<number[]>)) as jest.MockedFunction<IHttpClient['get']>
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.getSubjectVersions('subjectName');

    expect(result).toEqual([1, 2]);
    expect(client.get).toBeCalledTimes(1);
    expect(client.get).toBeCalledWith('/subjects/subjectName/versions')
  })

  it('should not retrieve versions for a subject if it does not exist', async () => {
    const error = { response: { status: 500, data: { error_code: '500', message: 'test err' } } };
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn(() => Promise.reject(error))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = sut.getSubjectVersions('subjectName');

    await expect(result).rejects.toEqual({ errorCode: '500', httpStatusCode: 500, message: 'test err' });
    expect(client.get).toBeCalledTimes(1);
  })

  it('should delete a subject', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      delete: jest.fn((resourceUri: string) => Promise.resolve({ data: [1, 2] } as unknown as IHttpResponse<number[]>)) as jest.MockedFunction<IHttpClient['delete']>
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.deleteSubject('subjectName');

    expect(result).toEqual([1, 2]);
    expect(client.delete).toBeCalledTimes(1);
    expect(client.delete).toBeCalledWith('/subjects/subjectName')
  })

  it('should not delete a subject if it does not exist', async () => {
    const error = { response: { status: 500, data: { error_code: '500', message: 'test err' } } };
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      delete: jest.fn(() => Promise.reject(error))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = sut.deleteSubject('subjectName');

    await expect(result).rejects.toEqual({ errorCode: '500', httpStatusCode: 500, message: 'test err' });
    expect(client.delete).toBeCalledTimes(1);
  })

  it('should delete a schema by subject version', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      delete: jest.fn((resourceUri: string) => Promise.resolve({ data: [1, 2] } as IHttpResponse<number[]>)) as jest.MockedFunction<IHttpClient['delete']>
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.deleteSchemaBySubjectVersion('subjectName', 3);

    expect(result).toEqual([1, 2]);
    expect(client.delete).toBeCalledTimes(1);
    expect(client.delete).toBeCalledWith('/subjects/subjectName/versions/3')
  })

  it('should not delete a schema by subject version if it does not exist', async () => {
    const error = { response: { status: 500, data: { error_code: '500', message: 'test err' } } };
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      delete: jest.fn(() => Promise.reject(error))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = sut.deleteSchemaBySubjectVersion('subjectName', 3);

    await expect(result).rejects.toEqual({ errorCode: '500', httpStatusCode: 500, message: 'test err' });
    expect(client.delete).toBeCalledTimes(1);
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
      get: jest.fn(() => Promise.resolve({ data: expectedResult } as unknown as IHttpResponse<ISchemaResult>)) as jest.MockedFunction<IHttpClient['get']>
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.getSchemaInfoBySubjectVersion('subjectName', 20);

    expect(result).toEqual(expectedResult);
    expect(client.get).toBeCalledTimes(1);
    expect(client.get).toBeCalledWith('/subjects/subjectName/versions/20')
  })



  // it('should retrieve latest schema information by subject', async () => {
  //   const expectedResult: ISchemaResult = {
  //     id: 10,
  //     schema: "{}",
  //     subject: 'subjectName',
  //     version: 3
  //   }
  //   const client: Partial<IHttpClient> = {
  //     addHeader: jest.fn(),
  //     get: jest.fn().mockResolvedValue({ data: expectedResult, message: '', statusCode: 200 } as unknown as IHttpResponse<ISchemaResult>) as jest.MockedFunction<IHttpClient['get']>
  //   }
  //   const sut = new SchemaRegistryHttpClient(client as IHttpClient);

  //   const result = await sut.getLatestSchemaInfoBySubject('subjectName');

  //   expect(result).toEqual(expectedResult);
  //   expect(client.get).toBeCalledTimes(1);
  //   expect(client.get).toBeCalledWith('/subjects/subjectName/versions/latest')
  // })

  it('should not retrieve latest information for a subject if it does not exist', async () => {
    const error = { response: { status: 500, data: { error_code: '500', message: 'test err' } } };
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn(() => Promise.reject(error))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = sut.getLatestSchemaInfoBySubject('subjectName');

    await expect(result).rejects.toEqual({ errorCode: '500', httpStatusCode: 500, message: 'test err' });
    expect(client.get).toBeCalledTimes(1);
  })

  it('should retrieve schema only by subject version', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn(() => Promise.resolve({ data: { schema: { key: 'schemaData' } }, message: '', statusCode: 200 } as unknown as IHttpResponse<any>))
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
      get: jest.fn(() => Promise.resolve({ data: { schema: { key: 'schemaData' } }, message: '', statusCode: 200 } as IHttpResponse<any>))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.getLatestSchemaBySubject('subjectName');

    expect(result).toEqual({ schema: { key: 'schemaData' } });
    expect(client.get).toBeCalledTimes(1);
    expect(client.get).toBeCalledWith('/subjects/subjectName/versions/latest/schema')
  })

  it('should create a new schema', async () => {
    const payload = { schema: "{}" };
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      post: jest.fn(() => Promise.resolve({ data: payload, message: '', statusCode: 200 } as unknown as IHttpResponse<any>))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.createSchema('subjectName', payload);

    expect(result).toEqual({ schema: "{}" });
    expect(client.post).toBeCalledTimes(1);
    expect(client.post).toBeCalledWith('/subjects/subjectName/versions', payload)
  })

  it('should throw an error when creating a new schema fails', async () => {
    const error = { response: { status: 500, data: { error_code: '500', message: 'test err' } } };
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      post: jest.fn(() => Promise.reject(error))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = sut.createSchema('subjectName', { schema: "{}" });

    await expect(result).rejects.toEqual({ errorCode: '500', httpStatusCode: 500, message: 'test err' });
    expect(client.post).toBeCalledTimes(1);
  })

  it('should identify if schema exists', async () => {
    const payload = { schema: "{}" };
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      post: jest.fn(() => Promise.resolve({ data: payload, message: '', statusCode: 200 } as IHttpResponse<any>))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.schemaExists('subjectName', payload);

    expect(result).toEqual({ schema: "{}" });
    expect(client.post).toBeCalledTimes(1);
    expect(client.post).toBeCalledWith('/subjects/subjectName', payload)
  })

  it('should update global config', async () => {
    const payload = { compatibility: CompatibilityType.FORWARD };
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      put: jest.fn(() => Promise.resolve({ data: payload } as unknown as IHttpResponse<any>))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.setGlobalCompatiblity(CompatibilityType.FORWARD);

    expect(result).toEqual(payload);
    expect(client.put).toBeCalledTimes(1);
    expect(client.put).toBeCalledWith('/config', payload)
  })

  it('should update subject config', async () => {
    const payload = { compatibility: CompatibilityType.FORWARD };
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      put: jest.fn(() => Promise.resolve({ data: payload } as IHttpResponse<any>))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.setSubjectCompatibility('subjectName', CompatibilityType.FORWARD);

    expect(result).toEqual(payload);
    expect(client.put).toBeCalledTimes(1);
    expect(client.put).toBeCalledWith('/config/subjectName', payload)
  })

  it('should get global config', async () => {
    const payload = { compatibility: CompatibilityType.FORWARD };
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn(() => Promise.resolve({ data: payload } as unknown as IHttpResponse<any>))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = await sut.getConfiguration();

    expect(result).toEqual(payload);
    expect(client.get).toBeCalledTimes(1);
    expect(client.get).toBeCalledWith('/config')
  })

  // it('should get subject config', async () => {
  //   const payload = { compatibility: CompatibilityType.FORWARD };
  //   const client: Partial<IHttpClient> = {
  //     addHeader: jest.fn(),
  //     get: jest.fn().mockResolvedValue({ data: payload, message: '', statusCode: 200 }) as jest.MockedFunction<IHttpClient['get']>

  //   }
  //   const sut = new SchemaRegistryHttpClient(client as IHttpClient);

  //   const result = await sut.getSubjectConfiguration('subjectName');

  //   expect(result).toEqual(payload);
  //   expect(client.get).toBeCalledTimes(1);
  //   expect(client.get).toBeCalledWith('/config/subjectName')
  // })

  it('should not get subject config when subject does not exist', async () => {
    const error = { response: { status: 500, data: { error_code: '500', message: 'test err' } } };
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn(),
      get: jest.fn(() => Promise.reject(error))
    }
    const sut = new SchemaRegistryHttpClient(client as IHttpClient);

    const result = sut.getSubjectConfiguration('subjectName');

    await expect(result).rejects.toEqual({ errorCode: '500', httpStatusCode: 500, message: 'test err' });
    expect(client.get).toBeCalledTimes(1);
    expect(client.get).toBeCalledWith('/config/subjectName')
  })
});
