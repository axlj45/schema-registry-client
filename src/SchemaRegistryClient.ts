import { CachingHttpClient, HttpClient, IHttpClient } from "./http-client";
import { AvroSchemaRegistryClient } from "./schema-registry-client";
import { SchemaRegistryHttpClient } from './schema-registry-http-client';

export class SchemaRegistryClient {

  public static get Instance(): AvroSchemaRegistryClient | undefined {
    return this.instance;
  }

  public static create(schemaRegistryUrl: string, cacheResults: boolean = true): AvroSchemaRegistryClient {
    const httpClient = this.getHttpClient(schemaRegistryUrl, cacheResults);
    const registryHttpClient = new SchemaRegistryHttpClient(httpClient);
    this.instance = new AvroSchemaRegistryClient(registryHttpClient);

    return this.instance;
  }

  private static instance: undefined | AvroSchemaRegistryClient = undefined;

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
