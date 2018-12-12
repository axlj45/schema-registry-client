import { IHttpClient } from '../http-client';
import { ISchemaRegistryHttpClient } from './ISchemaRegistryHttpClient';
import { CompatibilityType, IConfigurationResult, ISchemaRegistryError, ISchemaResult, SchemaRegistryErrorCode } from './models';

export class SchemaRegistryClient implements ISchemaRegistryHttpClient {
  constructor(private httpClient: IHttpClient) { }

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

  public async getConfigurationation(): Promise<IConfigurationResult> {
    const promise = this.httpClient
      .get<IConfigurationResult>('/config');

    const result = await promise;
    return result.data;
  }

  public setSubjectCompatibility(subjectName: string, compatiblity: CompatibilityType): Promise<IConfigurationResult> {
    throw new Error("Method not implemented.");
  }

  public async getSubjectConfiguration(subjectName: string): Promise<IConfigurationResult> {
    try {
      const result = await this.httpClient
        .get<IConfigurationResult>(`/config/${subjectName}`);
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  private toSchemaRegistryError(error: any): ISchemaRegistryError {
    const result: ISchemaRegistryError = {
      errorCode: error.response.data.error_code,
      httpStatusCode: error.response.status,
      message: error.response.data.message
    }
    return result;
  }
}
