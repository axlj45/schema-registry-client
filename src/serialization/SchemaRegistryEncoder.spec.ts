import { IMessageEncoder, SchemaRegistryEncoder } from './';
import ISchemaRegistryEncoding from './ISchemaRegistryEncoding';

describe('SchemaRegistryEncoder', () => {
  const encoder: IMessageEncoder = new SchemaRegistryEncoder();

  it('should short circuit if buffer is invalid width', () => {
    const buffer = Buffer.alloc(5);
    expect(() => encoder.decodeAvroBuffer(buffer)).toThrowError('Invalid buffer.')
  });

  it('should short circuit if buffer is not schema registry data', () => {
    const buffer = Buffer.alloc(10);
    buffer.write("0000000000");
    expect(() => encoder.decodeAvroBuffer(buffer))
      .toThrowError('Invalid schema registry data.  Unable to determine schema registry version.')
  });

  it('should correctly identify a schema registry id with a buffer', () => {
    const buffer = Buffer.alloc(8);
    buffer.writeUInt8(0, 0);
    buffer.writeUInt32BE(675, 1);
    buffer.write("ABC", 5);
    const decodedBuffer = encoder.decodeAvroBuffer(buffer);

    expect(decodedBuffer.versionByte).toBe(0);
    expect(decodedBuffer.schemaRegistryId).toBe(675);
    expect(decodedBuffer.buffer.toString()).toBe('ABC');
  })

  it('should short circuit if no buffer data is provided', () => {
    const request: ISchemaRegistryEncoding = {
      buffer: Buffer.alloc(0),
      schemaRegistryId: 10,
      versionByte: 0
    };

    expect(() => encoder.encodeAvroBuffer(request)).toThrow('No data found to encode.');
  })

  it('should return a valid buffer', () => {
    const data = 'some data';
    const request: ISchemaRegistryEncoding = {
      buffer: new Buffer(data),
      schemaRegistryId: 10,
      versionByte: 0
    };

    const schemaRegistryBuffer = encoder.encodeAvroBuffer(request);
    const response = schemaRegistryBuffer.buffer;

    const version = response.readUInt8(0);
    expect(version).toBe(0);

    const schemaId = response.readUInt32BE(1);
    expect(schemaId).toBe(10);

    const responseData = response.slice(5).toString();
    expect(responseData).toBe(data);
  })
})
