import { ISchemaRegistryClient } from './ISchemaRegistryClient';
import { ISchemaRegistryHttpClient } from './schema-registry-http-client';
import { IMessageEncoder, ISerializer } from './serialization';

export class AvroSchemaRegistryClient implements ISchemaRegistryClient {
  constructor(
    private client: ISchemaRegistryHttpClient,
    private serializer: ISerializer,
    private encoder: IMessageEncoder
  ) { }

  public async encodeBySubject<Tin>(obj: Tin, subject: string): Promise<Buffer> {
    const schemaInfo = await this.client.getLatestSchemaInfoBySubject(subject);
    const buffer = this.serializer.serialize(obj, schemaInfo.schema);
    const avroResult = this.encoder.encodeAvroBuffer({ buffer, schemaRegistryId: schemaInfo.id, versionByte: 0 });
    return avroResult.buffer || Buffer.alloc(0);
  }

  public async encodeById<Tin>(obj: Tin, id: number): Promise<Buffer> {
    const schemaRequest = await this.client.getSchemaById(id);
    const buffer = this.serializer.serialize(obj, JSON.parse(schemaRequest.schema));
    return buffer;
  }

  public async decode<Tout>(buffer: Buffer): Promise<Tout> {
    const encoding = this.encoder.decodeAvroBuffer(buffer);
    const schemaRequest = await this.client.getSchemaById(encoding.schemaRegistryId);
    const obj = this.serializer.deserialize<Tout>(encoding.buffer, JSON.parse(schemaRequest.schema));
    return obj;
  }
}
