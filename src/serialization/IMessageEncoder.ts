import ISchemaRegistryEncoding from "./ISchemaRegistryEncoding";

export interface IMessageEncoder {
  decodeAvroBuffer(buffer: Buffer): ISchemaRegistryEncoding;
  encodeAvroBuffer(request: ISchemaRegistryEncoding): ISchemaRegistryEncoding;
}
