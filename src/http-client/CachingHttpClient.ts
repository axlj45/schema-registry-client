import { IHttpClient, IHttpResponse } from '.';
import { Cache, ICache } from '../cache';

export class CachingHttpClient implements IHttpClient {

  constructor(private client: IHttpClient, private cache: ICache = new Cache()) { }

  public get<T>(resourceUri: string): Promise<IHttpResponse<T>> {
    return this.cache.get(resourceUri, () => this.client.get<T>(resourceUri));
  }

  public async post<Tin, Tout>(resourceUri: string, postData: Tin): Promise<IHttpResponse<Tout>> {
    return this.client.post(resourceUri, postData);
  }

  public async put<Tin, Tout>(resourceUri: string, putData: Tin): Promise<IHttpResponse<Tout>> {
    return this.client.put(resourceUri, putData);
  }

  public async delete<T>(resourceUri: string): Promise<IHttpResponse<T>> {
    return this.client.delete(resourceUri);
  }

  public addHeader(key: string, value: string): void {
    this.client.addHeader(key, value);
  }
}
