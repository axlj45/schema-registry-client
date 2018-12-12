import { SchemaRegistryErrorCode } from "./SchemaRegistryErrorCode";

export interface ISchemaRegistryError {
  httpStatusCode: number;
  errorCode: SchemaRegistryErrorCode;
  message: string;
}

