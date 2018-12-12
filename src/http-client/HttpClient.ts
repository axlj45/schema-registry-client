import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { IHttpClient } from "./IHttpClient";
import { IHttpResponse } from "./IHttpResponse";

export class HttpClient implements IHttpClient {

  public baseUrl: string;
  public config: AxiosRequestConfig;
  public client: AxiosInstance;

  constructor(baseUri: string) {
    this.baseUrl = baseUri;
    this.config = {
      baseURL: baseUri,
      headers: {
        "Accept": "application/vnd.schemaregistry.v1+json, application/vnd.schemaregistry+json, application/json"
      }
    };
    this.client = axios.create(this.config);
  }

  public addHeader(key: string, value: string): void {
    // this.client.defaults.headers.post[key] = value;
  }

  public get<T>(resourceUri: string): Promise<IHttpResponse<T>> {
    return new Promise<IHttpResponse<T>>((resolve, reject) => {
      return this.client
        .get(resourceUri)
        .then((result => {
          const data: IHttpResponse<T> = {
            data: result.data,
            message: result.statusText,
            statusCode: result.status,
          };
          resolve(data);
        }))
        .catch(reason => reject(reason));
    });
  }

  public post<Tin, Tout>(resourceUri: string, postData: Tin): Promise<IHttpResponse<Tout>> {
    return new Promise<IHttpResponse<Tout>>((resolve, reject) => {
      return this.client
        .post(resourceUri, postData)
        .then((result => {
          const data: IHttpResponse<Tout> = {
            data: result.data,
            message: result.statusText,
            statusCode: result.status,
          };
          resolve(data);
        }))
        .catch(reason => reject(reason));
    });
  }

  public put<Tin, Tout>(resourceUri: string, putData: Tin): Promise<IHttpResponse<Tout>> {
    return new Promise<IHttpResponse<Tout>>((resolve, reject) => {
      return this.client
        .put(resourceUri, putData)
        .then((result => {
          const data: IHttpResponse<Tout> = {
            data: result.data,
            message: result.statusText,
            statusCode: result.status,
          };
          resolve(data);
        }))
        .catch(reason => reject(reason));
    });
  }

  public delete<T>(resourceUri: string): Promise<IHttpResponse<T>> {
    return new Promise<IHttpResponse<T>>((resolve, reject) => {
      return this.client
        .delete(resourceUri)
        .then((result => {
          const data: IHttpResponse<T> = {
            data: result.data,
            message: result.statusText,
            statusCode: result.status,
          };
          resolve(data);
        }))
        .catch(reason => reject(reason));
    });
  }
}
