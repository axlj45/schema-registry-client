import { Type } from 'avsc';

function serialize<Tin>(obj: Tin, schema: string): Buffer {
  const avro = Type.forSchema(schema);
  return avro.toBuffer(obj);
}

function deserialize<Tout>(buffer: Buffer, schema: string): Tout {
  const avro = Type.forSchema(schema);
  return avro.fromBuffer(buffer);
}

export default { serialize, deserialize };
