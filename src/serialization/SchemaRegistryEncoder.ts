import ISchemaRegistryEncoding from "./ISchemaRegistryEncoding";

export class SchemaRegistryEncoder {

  // Single byte version identifier for schema registry
  private VERSION_BUFFER_POSITION = 0;
  private SCHEMA_REGISTRY_VERSION = 0;
  private VERSION_BUFFER_WIDTH = 1;

  // 4byte integer stored big endian
  private ID_BUFFER_POSITION = 1;
  private ID_BUFFER_WIDTH = 4;

  public decodeAvroBuffer(buffer: Buffer): ISchemaRegistryEncoding {
    if (buffer.length < 6) {
      throw Error('Invalid buffer.');
    }

    const versionByte = buffer.readUInt8(this.VERSION_BUFFER_POSITION);

    if (versionByte !== this.SCHEMA_REGISTRY_VERSION) {
      throw Error("Invalid schema registry data.  Unable to determine schema registry version.")
    }

    const schemaRegistryId = buffer.readUInt32BE(this.ID_BUFFER_POSITION);
    return { versionByte, schemaRegistryId, buffer: buffer.slice(5) };
  }

  public encodeAvroBuffer(request: ISchemaRegistryEncoding): ISchemaRegistryEncoding {
    const buffer = request.buffer;
    const originalBufferLength = buffer.length;

    if (originalBufferLength === 0) {
      throw Error('No data found to encode.');
    }

    const encodingLength = this.VERSION_BUFFER_WIDTH + this.ID_BUFFER_WIDTH;
    const registryBufferSize = encodingLength + originalBufferLength;

    const registryBuffer = Buffer.alloc(registryBufferSize);
    registryBuffer.writeUInt8(request.versionByte, this.SCHEMA_REGISTRY_VERSION);
    registryBuffer.writeUInt32BE(request.schemaRegistryId, this.ID_BUFFER_POSITION);
    buffer.copy(registryBuffer, encodingLength);

    return {
      buffer: registryBuffer,
      schemaRegistryId: request.schemaRegistryId,
      versionByte: request.versionByte,
    };
  }
}
