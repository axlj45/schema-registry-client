import { CachingHttpClient, HttpClient, IHttpClient } from "./http-client";
import { SchemaRegistryHttpClient } from './schema-registry-http-client';

export class SchemaRegistryApiClient {

  public static get Instance(): SchemaRegistryHttpClient | undefined {
    return this.instance;
  }

  public static create(schemaRegistryUrl: string, cacheResults: boolean = true): SchemaRegistryHttpClient {
    const httpClient = this.getHttpClient(schemaRegistryUrl, cacheResults);
    this.instance = new SchemaRegistryHttpClient(httpClient);

    return this.instance;
  }

  private static instance: undefined | SchemaRegistryHttpClient = undefined;

  private static getHttpClient(url: string, cacheResults: boolean): IHttpClient {
    const httpClient = new HttpClient(url);

    if (cacheResults) {
      return new CachingHttpClient(httpClient);
    }
    else {
      return httpClient;
    }
  }
}
