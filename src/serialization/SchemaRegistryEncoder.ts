import ISchemaRegistryEncoding from "./ISchemaRegistryEncoding";

const VERSION_POSITION = 0; // Single byte version identifier for schema registry
const ID_POSITION = 1; // 4byte integer stored big endian

function getRegistryIdFromBuffer(buffer: Buffer): ISchemaRegistryEncoding {
  const versionByte = buffer.readUInt8(VERSION_POSITION);
  if (versionByte !== 0) {
    throw Error("Invalid schema registry data.  Unable to determine schema registry versioin.")
  }

  const schemaRegistryId = buffer.readUInt32BE(ID_POSITION);
  return { versionByte, schemaRegistryId, buffer };
}

function encodeAvroBuffer(request: ISchemaRegistryEncoding): ISchemaRegistryEncoding {
  const buffer = request.buffer || new Buffer(5);
  const originalLength = buffer.length || 0;

  // version byte + integer width + existing buffer size
  const registryBufferSize = 1 + 4 + originalLength;

  const registryBuffer = new Buffer(registryBufferSize);
  registryBuffer.writeUInt8(request.versionByte, 0);
  registryBuffer.writeUInt32BE(request.schemaRegistryId, 1);
  buffer.copy(registryBuffer, 5);

  return {
    buffer: registryBuffer,
    schemaRegistryId: request.schemaRegistryId,
    versionByte: request.versionByte,
  };
}
