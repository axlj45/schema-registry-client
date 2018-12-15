import { ICache } from '.';

export class Cache implements ICache {

  private cache: Map<string, Promise<any>>;

  constructor() {
    this.cache = new Map<string, any>();
  }

  public async get<T>(key: string, storeFn: () => Promise<T>): Promise<T> {
    const value = this.cache.get(key);

    if (value === undefined) {
      this.cache.set(key, storeFn())
    }

    const fetch = this.cache.get(key);;

    try {
      const result = await fetch;
      return result;
    }
    catch (err) {
      this.delete(key);
      throw err;
    }
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }
}
