import { IHttpClient } from '../http-client';
import { ISchemaRegistryHttpClient } from './ISchemaRegistryHttpClient';
import { CompatibilityType, IConfigurationResult, ISchemaRegistryError, ISchemaResult } from './models';
import { ISchemaRequest } from './models/ISchemaRequest';

export class SchemaRegistryClient implements ISchemaRegistryHttpClient {
  constructor(private httpClient: IHttpClient) {
    httpClient.addHeader("Accept", "application/vnd.schemaregistry.v1+json, application/vnd.schemaregistry+json, application/json");
  }

  public async isCompatible(targetSubjectName: string, targetSubjectVersion: string, sourceSchema: ISchemaRequest): Promise<boolean> {
    const resource = `/compatibility/subjects/${targetSubjectName}/versions/${targetSubjectVersion}`;
    try {
      const result = await this.httpClient
        .post<ISchemaRequest, boolean>(resource, sourceSchema);
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async isCompatibleAgainstLatest(targetSubjectName: string, sourceSchema: ISchemaRequest): Promise<boolean> {
    return this.isCompatible(targetSubjectName, 'latest', sourceSchema);
  }

  public async getSchemaById(id: number): Promise<string> {
    try {
      const result = await this.httpClient
        .get<string>(`/schemas/ids/${id}`);;
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async getSubjects(): Promise<string[]> {
    try {
      const result = await this.httpClient
        .get<string[]>('/subjects');;
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async getSubjectVersions(subjectName: string): Promise<number[]> {
    try {
      const result = await this.httpClient
        .get<number[]>(`/subjects/${subjectName}/versions`);;
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async deleteSubject(subjectName: string): Promise<number[]> {
    try {
      const result = await this.httpClient
        .delete<number[]>(`/subjects/${subjectName}`);;
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async deleteSchemaBySubjectVersion(subjectName: string, versionIdentifier: number): Promise<number> {
    try {
      const result = await this.httpClient
        .delete<number>(`/subjects/${subjectName}/versions/${versionIdentifier}`);;
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async getSchemaInfoBySubjectVersion(subjectName: string, versionIdentifier: number): Promise<ISchemaResult> {
    try {
      const result = await this.httpClient
        .get<ISchemaResult>(`/subjects/${subjectName}/versions/${versionIdentifier}`);;
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async getSchemaBySubjectVersion(subjectName: string, versionIdentifier: number): Promise<string> {
    try {
      const result = await this.httpClient
        .get<string>(`/subjects/${subjectName}/versions/${versionIdentifier}/schema`);;
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async createSchema(subjectName: string, schema: ISchemaRequest): Promise<ISchemaResult> {
    try {
      const result = await this.httpClient
        .post<ISchemaRequest, ISchemaResult>(`/subjects/${subjectName}/versions`, schema);;
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async schemaExists(subjectName: string, schema: ISchemaRequest): Promise<ISchemaResult> {
    try {
      const result = await this.httpClient
        .post<ISchemaRequest, ISchemaResult>(`/subjects/${subjectName}`, schema);;
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async setGlobalCompatiblity(compatibility: CompatibilityType): Promise<IConfigurationResult> {
    try {
      const result = await this.httpClient
        .put<IConfigurationResult, IConfigurationResult>(`/config`, { compatibility });
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async getConfigurationation(): Promise<IConfigurationResult> {
    try {
      const result = await this.httpClient
        .get<IConfigurationResult>('/config');;
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async setSubjectCompatibility(subjectName: string, compatibility: CompatibilityType): Promise<IConfigurationResult> {
    try {
      const result = await this.httpClient
        .put<IConfigurationResult, IConfigurationResult>(`/config/${subjectName}`, { compatibility });
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
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
