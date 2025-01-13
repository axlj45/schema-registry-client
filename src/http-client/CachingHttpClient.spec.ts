import { CachingHttpClient, IHttpClient } from '.';

describe('CachingHttpClient', () => {
  it('should only call get once', async () => {
    const client: Partial<IHttpClient> = {
      get: jest.fn(() => Promise.resolve({ message: '', statusCode: 200, data: {} as any }))
    }
    const sut: IHttpClient = new CachingHttpClient(client as IHttpClient);

    const result1 = sut.get('/path1');
    const result2 = sut.get('/path1');

    await Promise.all([result1, result2]);

    expect(client.get).toBeCalledTimes(1);
  })

  it('should call post as many times at is called', async () => {
    const client: Partial<IHttpClient> = {
      post: jest.fn(() => Promise.resolve({ message: '', statusCode: 200, data: {} as any }))
    }
    const sut: IHttpClient = new CachingHttpClient(client as IHttpClient);

    const result1 = sut.post('/path1', {});
    const result2 = sut.post('/path1', {});

    await Promise.all([result1, result2]);

    expect(client.post).toBeCalledTimes(2);
  })

  it('should call put as many times at is called', async () => {
    const client: Partial<IHttpClient> = {
      put: jest.fn(() => Promise.resolve({ message: '', statusCode: 200, data: {} as any }))
    }
    const sut: IHttpClient = new CachingHttpClient(client as IHttpClient);

    const result1 = sut.put('/path1', {});
    const result2 = sut.put('/path1', {});

    await Promise.all([result1, result2]);

    expect(client.put).toBeCalledTimes(2);
  })

  it('should call delete as many times at is called', async () => {
    const client: Partial<IHttpClient> = {
      delete: jest.fn(() => Promise.resolve({ message: '', statusCode: 200, data: {} as any}))
    }
    const sut: IHttpClient = new CachingHttpClient(client as IHttpClient);

    const result1 = sut.delete('/path1');
    const result2 = sut.delete('/path1');

    await Promise.all([result1, result2]);

    expect(client.delete).toBeCalledTimes(2);
  })

  it('should proxy addHeader', async () => {
    const client: Partial<IHttpClient> = {
      addHeader: jest.fn()
    }
    const sut: IHttpClient = new CachingHttpClient(client as IHttpClient);

    sut.addHeader('key', 'value');

    expect(client.addHeader).toBeCalledTimes(1);
  })
})
