export interface ISchemaRegistryClient {
  encodeBySubject<Tin>(obj: Tin, subject: string): Promise<Buffer>;
  encodeById<Tin>(obj: Tin, id: number): Promise<Buffer>;
  decode<Tout>(buffer: Buffer): Promise<Tout>;
}
