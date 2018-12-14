export interface ISerializer {
  serialize<Tin>(obj: Tin, schema: string): Buffer;
  deserialize<Tout>(buffer: Buffer, schema: string): Tout;
}
