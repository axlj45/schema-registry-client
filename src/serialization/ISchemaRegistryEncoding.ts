export default interface ISchemaRegistryEncoding {
  versionByte: number;
  schemaRegistryId: number;
  buffer: Buffer;
}
