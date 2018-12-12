import { IHttpResponse } from './IHttpResponse';

export interface IHttpClient {
  get<T>(resourceUri: string): Promise<IHttpResponse<T>>;
  post<T>(resourcrUri: string, postData: T): Promise<IHttpResponse<T>>;
  put<T>(resourceUri: string, putData: T): Promise<IHttpResponse<T>>;
  delete(resourceUri: string): Promise<IHttpResponse<string>>;
  addHeader(key: string, value: string): void;
}
