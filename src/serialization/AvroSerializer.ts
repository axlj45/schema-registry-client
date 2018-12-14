import { Type } from 'avsc';
import { ISerializer } from './ISerializer';

export class AvroSerializer implements ISerializer {
  public serialize<Tin>(obj: Tin, schema: string): Buffer {
    const avro = Type.forSchema(schema);
    return avro.toBuffer(obj);
  }

  public deserialize<Tout>(buffer: Buffer, schema: string): Tout {
    const avro = Type.forSchema(schema);
    return avro.fromBuffer(buffer);
  }
}
