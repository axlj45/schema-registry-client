import { AvroSchemaRegistryClient } from "./AvroSchemaRegistryClient";
import { HttpClient } from "./http-client";
import { SchemaRegistryHttpClient } from './schema-registry-http-client';

export class SchemaRegistryClient {

  public static get Instance(): AvroSchemaRegistryClient | undefined {
    return this.instance;
  }

  public static create(schemaRegistryUrl: string): AvroSchemaRegistryClient {
    const httpClient = new HttpClient(schemaRegistryUrl);
    const registryHttpClient = new SchemaRegistryHttpClient(httpClient);

    this.instance = new AvroSchemaRegistryClient(registryHttpClient);
    return this.instance;
  }

  private static instance: undefined | AvroSchemaRegistryClient = undefined;
}
