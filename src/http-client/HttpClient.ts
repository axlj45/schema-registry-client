import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { IHttpClient } from "./IHttpClient";
import { IHttpResponse } from "./IHttpResponse";

export class HttpClient implements IHttpClient {
  public baseUrl: string;
  public config: AxiosRequestConfig;
  public client: AxiosInstance;

  constructor(baseUri: string) {
    this.baseUrl = baseUri;
    this.config = { baseURL: baseUri };
    this.client = axios.create(this.config);
  }

  public get<T>(resourceUri: string): Promise<IHttpResponse<T>> {
    return new Promise<IHttpResponse<T>>((resolve, reject) => {
      return this.client
        .get(resourceUri)
        .then((result => {
          const data: IHttpResponse<T> = {
            data: JSON.parse(result.data),
            message: result.statusText,
            statusCode: result.status,
          };
          resolve(data);
        }))
        .catch(reason => reject(reason));
    });
  }

  public post<T>(resourceUri: string, postData: T): Promise<IHttpResponse<T>> {
    return new Promise<IHttpResponse<T>>((resolve, reject) => {
      return this.client
        .post(resourceUri, JSON.stringify(postData))
        .then((result => {
          const data: IHttpResponse<T> = {
            data: JSON.parse(result.data),
            message: result.statusText,
            statusCode: result.status,
          };
          resolve(data);
        }))
        .catch(reason => reject(reason));
    });
  }

  public put<T>(resourceUri: string, putData: T): Promise<IHttpResponse<T>> {
    return new Promise<IHttpResponse<T>>((resolve, reject) => {
      return this.client
        .put(resourceUri, JSON.stringify(putData))
        .then((result => {
          const data: IHttpResponse<T> = {
            data: JSON.parse(result.data),
            message: result.statusText,
            statusCode: result.status,
          };
          resolve(data);
        }))
        .catch(reason => reject(reason));
    });
  }

  public delete(resourceUri: string): Promise<IHttpResponse<string>> {
    return new Promise<IHttpResponse<string>>((resolve, reject) => {
      return this.client
        .get(resourceUri)
        .then((result => {
          const data: IHttpResponse<string> = {
            data: result.data,
            message: result.statusText,
            statusCode: result.status,
          };
          resolve(data);
        })).catch(reason => reject(reason));
    });
  }
}
