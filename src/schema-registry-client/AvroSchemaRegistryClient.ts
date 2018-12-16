import { ISchemaRegistryHttpClient } from '../schema-registry-http-client';
import { ISchemaResult } from '../schema-registry-http-client/models';
import { AvroSerializer, IMessageEncoder, ISerializer, SchemaRegistryEncoder } from '../serialization';
import { ISchemaRegistryClient } from './ISchemaRegistryClient';

export class AvroSchemaRegistryClient implements ISchemaRegistryClient {
  constructor(
    private client: ISchemaRegistryHttpClient,
    private serializer: ISerializer = new AvroSerializer(),
    private encoder: IMessageEncoder = new SchemaRegistryEncoder()
  ) { }

  public async encodeBySubject<Tin>(obj: Tin, subject: string): Promise<Buffer> {
    const schemaInfo = await this.client.getLatestSchemaInfoBySubject(subject);
    const buffer = this.serializer.serialize(obj, schemaInfo.schema);
    const avroResult = this.encoder.encodeAvroBuffer({ buffer, schemaRegistryId: schemaInfo.id, versionByte: 0 });
    return avroResult.buffer;
  }

  public async encodeById<Tin>(obj: Tin, id: number): Promise<Buffer> {
    const schemaRequest = await this.client.getSchemaById(id);
    const buffer = this.serializer.serialize(obj, schemaRequest.schema);
    const avroResult = this.encoder.encodeAvroBuffer({ buffer, schemaRegistryId: id, versionByte: 0 });
    return avroResult.buffer;
  }

  public async decode<Tout>(buffer: Buffer): Promise<Tout> {
    const encoding = this.encoder.decodeAvroBuffer(buffer);
    const schemaRequest = await this.client.getSchemaById(encoding.schemaRegistryId);
    const obj = this.serializer.deserialize<Tout>(encoding.buffer, schemaRequest.schema);
    return obj;
  }

  public async createSchema(subjectName: string, schema: object): Promise<ISchemaResult> {
    const result = await this.client.createSchema(subjectName, { schema: JSON.stringify(schema) });
    return {
      id: result.id,
      schema: JSON.parse(result.schema).schema,
      subject: result.subject,
      version: result.version,
    };
  }
}
