import { IHttpResponse } from './IHttpResponse';

export interface IHttpClient {
  get<T>(resourceUri: string): Promise<IHttpResponse<T>>;
  post<Tin, Tout>(resourcrUri: string, postData: Tin): Promise<IHttpResponse<Tout>>;
  put<Tin, Tout>(resourceUri: string, putData: Tin): Promise<IHttpResponse<Tout>>;
  delete<T>(resourceUri: string): Promise<IHttpResponse<T>>;
  addHeader(key: string, value: string): void;
}
