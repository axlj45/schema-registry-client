import { ISchemaRegistryHttpClient } from './ISchemaRegistryHttpClient';
import { CompatibilityType, IConfigurationResult, ISchemaResult } from './models';

export class SchemaRegistryClient implements ISchemaRegistryHttpClient {
  public isCompatible(targetSubjectName: string, targetSubjectVersion: string, sourceSchema: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  public isCompatibleAgainstLatest(targetSubjectName: string, sourceSchema: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  public getSchemaById(id: number): Promise<string> {
    throw new Error("Method not implemented.");
  }
  public getSubjects(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  public getSubjectVersions(subjectName: string): Promise<number[]> {
    throw new Error("Method not implemented.");
  }
  public deleteSubject(subjectName: string): Promise<number[]> {
    throw new Error("Method not implemented.");
  }
  public deleteSchemaBySubjectVersion(subjectName: string, versionIdentifier: number): Promise<number> {
    throw new Error("Method not implemented.");
  }
  public getSchemaInfoBySubjectVersion(subjectName: string, versionIdentifier: number): Promise<ISchemaResult> {
    throw new Error("Method not implemented.");
  }
  public getSchemaBySubjectVersion(subjectName: string, versionIdentifier: number): Promise<string> {
    throw new Error("Method not implemented.");
  }
  public createSchema(subjectName: string, schema: string): Promise<ISchemaResult> {
    throw new Error("Method not implemented.");
  }
  public schemaExists(subjectName: string, schema: string): Promise<ISchemaResult> {
    throw new Error("Method not implemented.");
  }
  public setGlobalCompatiblity(compatiblity: CompatibilityType): Promise<IConfigurationResult> {
    throw new Error("Method not implemented.");
  }
  public getConfigurationation(): Promise<IConfigurationResult> {
    throw new Error("Method not implemented.");
  }
  public setSubjectCompatibility(subjectName: string, compatiblity: CompatibilityType): Promise<IConfigurationResult> {
    throw new Error("Method not implemented.");
  }
  public getSubjectConfiguration(subjectName: string): Promise<IConfigurationResult> {
    throw new Error("Method not implemented.");
  }
}
