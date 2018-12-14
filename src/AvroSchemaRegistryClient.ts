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
    const registrySchema = await this.client.getLatestSchemaBySubject(subject);
    const schema = JSON.stringify(registrySchema);
    const buffer = this.serializer.serialize(obj, schema);
    return buffer;
  }

  public async encodeById<Tin>(obj: Tin, id: number): Promise<Buffer> {
    const registrySchema = await this.client.getSchemaById(id);
    const schema = JSON.stringify(registrySchema);
    const buffer = this.serializer.serialize(obj, schema);
    return buffer;
  }

  public async decode<Tout>(buffer: Buffer): Promise<Tout> {
    const encoding = this.encoder.decodeAvroBuffer(buffer);
    const registrySchema = await this.client.getSchemaById(encoding.schemaRegistryId);
    const schema = JSON.stringify(registrySchema);
    const obj = this.serializer.deserialize<Tout>(buffer, schema);
    return obj;
  }
}
