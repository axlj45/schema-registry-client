import { Cache, ICache } from './';

describe('Cache', () => {
  it('should retrieve a stored item as a promise', async () => {
    const cache: ICache = new Cache();
    const testData = { 'data': null };

    const data = await cache.get('item1', () => Promise.resolve(testData));
    expect(data).toBe(testData);
  });

  it('should only call the store function once', async () => {
    const cache: ICache = new Cache();
    const testData = { 'data': null };

    const storeFn = jest.fn(() => Promise.resolve(testData));

    const result = await Promise.all([
      cache.get('item1', () => storeFn()),
      cache.get('item1', () => storeFn()),
      cache.get('item1', () => storeFn()),
      cache.get('item1', () => storeFn()),
      cache.get('item1', () => storeFn()),
      cache.get('item1', () => storeFn()),
      cache.get('item1', () => storeFn())
    ]);

    result.forEach(data => expect(data).toBe(testData));

    expect(storeFn).toBeCalledTimes(1);
  })

  it('should not store another item if a key already exists', async () => {
    const cache: ICache = new Cache();

    const storeFnA = jest.fn(() => Promise.resolve('A'));
    const storeFnB = jest.fn(() => Promise.resolve('B'));

    const itemAStoreFnA = await cache.get('ItemA', () => storeFnA());
    expect(itemAStoreFnA).toBe('A');

    const itemAStoreFnB = await cache.get('ItemA', () => storeFnB());
    expect(itemAStoreFnB).toBe('A');

    expect(storeFnB).not.toBeCalled();
    expect(storeFnA).toBeCalledTimes(1);
  });

  it('should not store an item if promise is unable to resolve', async () => {
    const cache: ICache = new Cache();

    const msg = 'storeFnErr error occured';

    const storeFnErr = async () => {
      return Promise.reject(msg);
    };

    const fetch = cache.get('ItemA', () => storeFnErr())

    expect(fetch).rejects.toEqual(msg);
  });

  it('should delete an item', async () => {
    const cache: ICache = new Cache();

    const storeFnA = jest.fn(() => Promise.resolve('A'));
    const storeFnB = jest.fn(() => Promise.resolve('B'));

    const itemAStoreFnA = await cache.get('ItemA', () => storeFnA());
    expect(itemAStoreFnA).toBe('A');

    cache.delete('ItemA');

    const itemAStoreFnB = await cache.get('ItemA', () => storeFnB());
    expect(itemAStoreFnB).toBe('B');

    expect(storeFnB).toBeCalledTimes(1);
    expect(storeFnA).toBeCalledTimes(1);
  });
});
