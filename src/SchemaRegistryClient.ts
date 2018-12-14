import { AvroSchemaRegistryClient } from "./AvroSchemaRegistryClient";
import { HttpClient } from "./http-client";
import { SchemaRegistryHttpClient } from './schema-registry-http-client';
import { AvroSerializer, SchemaRegistryEncoder } from "./serialization";

export class SchemaRegistryClient {

  public static get Instance(): AvroSchemaRegistryClient | undefined {
    return this.instance;
  }

  public static create(schemaRegistryUrl: string): AvroSchemaRegistryClient {
    const encoder = new SchemaRegistryEncoder();
    const serializer = new AvroSerializer();

    const httpClient = new HttpClient(schemaRegistryUrl);
    const registryHttpClient = new SchemaRegistryHttpClient(httpClient);

    this.instance = new AvroSchemaRegistryClient(registryHttpClient, serializer, encoder);
    return this.instance;
  }

  private static instance: undefined | AvroSchemaRegistryClient = undefined;
}
