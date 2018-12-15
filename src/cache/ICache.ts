export interface ICache {
  get<T>(key: string, storeFn: () => Promise<T>): Promise<T>;
  delete(key: string): void;
}
